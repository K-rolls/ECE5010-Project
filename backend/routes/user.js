const express = require("express");
const router = express.Router();
const database = require("../db/db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");
// const spotify = require('../spotify/spotify.js');
const { v3: uuidv3 } = require("uuid");

router.post("/signUp", (request, response) => {
  const { user } = request.body;
  const namespace = "666f849c-326f-4922-8252-c97cef969af5";
  const user_id = uuidv3(user.username, namespace);

  bcrypt.hash(user.password, 12).then((hashed_password) => {
    database("users")
      .where({ username: user.username })
      .first()
      .then((existingUser) => {
        if (existingUser) {
          // User with the same username already exists
          return response.status(409).json({ error: "Username already taken" });
        } else {
          return database("users")
            .insert({
              user_id: user_id,
              username: user.username,
              password_hash: hashed_password,
            })
            .returning("*")
            .then((users) => {
              const user = users[0];
              return response.json({ user });
            })
            .catch((error) => {
              return response.json({ error: error.message });
            });
        }
      });
  });
});

router.post("/login", (request, response) => {
  const { user } = request.body;
  database("users")
    .where({ username: user.username })
    .first()
    .then((retrievedUser) => {
      if (!retrievedUser) throw new Error("user not found!");
      return Promise.all([
        bcrypt.compare(user.password, retrievedUser.password_hash),
        Promise.resolve(retrievedUser),
      ]).then((results) => {
        const areSamePasswords = results[0];
        if (!areSamePasswords) throw new Error("wrong Password!");
        const retrievedUser = results[1];
        // console.log(results)
        const payload = {
          username: retrievedUser.username,
          User_ID: retrievedUser.User_ID,
        };
        //console.log(payload);
        const secret = "SECRET";
        return new Promise((resolve, reject) => {
          jwt.sign(payload, secret, (error, token) => {
            if (error) reject(new Error("Sign in error!"));
            resolve({ token, User_ID: retrievedUser.User_ID }); // Include user_id in response
          });
        });
      });
    })
    .then((result) => {
      // return the result to the client
      return response.json(result);
    })
    .catch((error) => {
      return response.json({ message: error.message });
    });
});

function authenticate(request, response, next) {
  const token = request.headers.authorization;
  const secret = "SECRET";
  jwt.verify(token, secret, (error, payload) => {
    if (error) {
      console.error(error);
      return response.json({ message: "sign in error!" });
    }
    database("users")
      .where({ username: payload.username })
      .first()
      .then((user) => {
        request.user = user;
        next();
      })
      .catch((error) => {
        return response.json({ message: error.message });
      });
  });
}

router.get("/welcome", authenticate, (request, response) => {
  return response.json({ message: `Welcome ${request.user.username}!` });
});

router.post("/makeReview", async (request, response) => {
  const { token, albumID, review, rating } = request.body;
  const decodedToken = jwt.decode(token);
  const uuid = decodedToken ? decodedToken.User_ID : null;

  try {
    await database.transaction(async (trx) => {
      const existingRow = await database("lookUp")
        .select("User_ID", "Album_ID")
        .where({
          User_ID: uuid,
          Album_ID: albumID,
        })
        .first()
        .transacting(trx);

      if (existingRow) {
        await database("reviews")
          .where({
            User_ID: uuid,
            Album_ID: albumID,
          })
          .update({
            review: review,
            rating: rating,
          })
          .transacting(trx);
        return response.json({
          success: true,
          message: "Review updated successfully",
        });
      } else {
        await database("lookUp")
          .insert({
            User_ID: uuid,
            Album_ID: albumID,
          })
          .transacting(trx);
        await database("reviews")
          .insert({
            User_ID: uuid,
            Album_ID: albumID,
            review: review,
            rating: rating,
          })
          .transacting(trx);
        return response.json({
          success: true,
          message: "Review added successfully",
        });
      }
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/getReviewed", async (request, response) => {
  const { token } = request.body;
  const decodedToken = jwt.decode(token);
  const uuid = decodedToken ? decodedToken.User_ID : null;

  // Get all reviewed albums in order of most recent to least recent
  let reviewedAlbums;
  try {
    reviewedAlbums = await database("reviews")
      .select("Album_ID")
      .where({ user_id: uuid })
      .orderByRaw("id desc");
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }

  // Get the top four reviewed albums
  const recents = reviewedAlbums
    .slice(0, 4)
    .map((review) => review.Album_ID);

  // Get the top rated albums based on the user's reviews
  let topRatedAlbums;
  try {
    topRatedAlbums = await database("reviews")
      .select("Album_ID")
      .where({ user_id: uuid })
      .orderByRaw("CAST(rating AS INTEGER) DESC, id DESC")
      .limit(4);


    console.log(topRatedAlbums);
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }

  const albumIds = reviewedAlbums.map((review) => review.Album_ID);

  // Get the metadata associated with the top four albums and all reviewed albums
  try {
    const albumData = await axios.post("http://localhost:5000/spotify/getAlbums", {
      Reviewed: albumIds,
    }, {
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Origin, Content-Type, Accept"
      }
    });

    const recentImages = albumData.data.filter((album) =>
      recents.includes(album.id)
    );
    const reviewedImages = albumData.data.filter((album) =>
      reviewedAlbums.map((review) => review.Album_ID).includes(album.id)
    );
    const topRatedImages = albumData.data.filter((album) =>
      topRatedAlbums.map((review) => review.Album_ID).includes(album.id)
    ).sort((a, b) => {
      const aIndex = topRatedAlbums.findIndex((review) => review.Album_ID === a.id);
      const bIndex = topRatedAlbums.findIndex((review) => review.Album_ID === b.id);
      return aIndex - bIndex;
    });

    console.log(topRatedImages);

    return response.json({
      recents: recentImages,
      reviewed: reviewedImages,
      topRated: topRatedImages
    });
  } catch (error) {
    return response.json({
      success: false,
      message: error.message,
    });
  }
});


module.exports = router;
