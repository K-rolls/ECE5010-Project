const express = require("express");
const router = express.Router();
const database = require("../db/db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");
// const spotify = require('../spotify/spotify.js');
const { v3: uuidv3 } = require("uuid");

router.post("/signUp", async (request, response) => {
  try {
    const { user } = request.body;
    const namespace = "666f849c-326f-4922-8252-c97cef969af5";
    const user_id = uuidv3(user.username, namespace);

    const existingUser = await database("users").where({ username: user.username }).first();
    if (existingUser) {
      return response.status(409).json({ error: "Username already taken" });
    }

    const hashed_password = await bcrypt.hash(user.password, 12);
    const users = await database("users").insert({
      user_id: user_id,
      username: user.username,
      password_hash: hashed_password
    }).returning("*");

    const createdUser = users[0];
    return response.json({ user: createdUser });
  } catch (error) {
    return response.json({ error: error.message });
  }
});

router.post("/login", (request, response) => {
  const { user } = request.body;
  database("users")
    .where({ username: user.username })
    .first()
    .then(async (retrievedUser) => {
      if (!retrievedUser) throw new Error("user not found!");
      const results = await Promise.all([
        bcrypt.compare(user.password, retrievedUser.password_hash),
        Promise.resolve(retrievedUser),
      ]);
      const areSamePasswords = results[0];
      if (!areSamePasswords)
        throw new Error("wrong Password!");
      const retrievedUser_1 = results[1];
      // console.log(results)
      const payload = {
        username: retrievedUser_1.username,
        User_ID: retrievedUser_1.User_ID,
      };
      //console.log(payload);
      const secret = "SECRET";
      return await new Promise((resolve, reject) => {
        jwt.sign(payload, secret, (error, token) => {
          if (error)
            reject(new Error("Sign in error!"));
          resolve({ token, User_ID: retrievedUser_1.User_ID }); // Include user_id in response
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

  try {
    const payload = jwt.verify(token, secret);
    database("users")
      .where({ username: payload.username })
      .first()
      .then((user) => {
        request.user = user;
        next();
      })
      .catch((error) => {
        console.error(error);
        return response.json({ message: "User not found!" });
      });
  } catch (error) {
    console.error(error);
    return response.json({ message: "Sign in error!" });
  }
}

router.get("/welcome", authenticate, (request, response) => {
  return response.json({ message: `Welcome ${request.user.username}!` });
});

router.post("/makeReview", async (request, response) => {
  try {
    const { token, albumID, review, rating } = request.body;
    const decodedToken = jwt.decode(token);
    const userID = decodedToken ? decodedToken.User_ID : null;

    await database.transaction(async (trx) => {
      const existingRow = await database("lookUp")
        .select("User_ID", "Album_ID")
        .where({
          User_ID: userID,
          Album_ID: albumID,
        })
        .first()
        .transacting(trx);

      if (existingRow) {
        await database("reviews")
          .where({
            User_ID: userID,
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
            User_ID: userID,
            Album_ID: albumID,
          })
          .transacting(trx);

        await database("reviews")
          .insert({
            User_ID: userID,
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
    console.error(error);
    return response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/getReviewed", async (request, response) => {
  const { token } = request.body;
  const decodedToken = jwt.decode(token);
  const uuid = decodedToken ? decodedToken.User_ID : null;

  try {
    // Get all reviewed albums in order of most recent to least recent
    const reviewedAlbums = await database("reviews")
      .select("Album_ID")
      .where({ user_id: uuid })
      .orderBy("id", "desc");

    // Get the top four reviewed albums
    const recents = reviewedAlbums.slice(0, 4).map((review) => review.Album_ID);

    // Get the top rated albums based on the user's reviews
    const topRatedAlbums = await database("reviews")
      .select("Album_ID")
      .where({ user_id: uuid })
      .orderByRaw("CAST(rating AS INTEGER) DESC, id DESC")
      .limit(4);

    const albumIds = reviewedAlbums.map((review) => review.Album_ID);

    // Get the metadata associated with the top four albums and all reviewed albums
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

    const reviewedImages = albumData.data.filter((album) =>
      albumIds.includes(album.id)
    );
    const recentImages = albumData.data.filter((album) =>
      recents.includes(album.id)
    );
    const topRatedImages = albumData.data.filter((album) =>
      topRatedAlbums.map((review) => review.Album_ID).includes(album.id)
    ).sort((a, b) => {
      const aIndex = topRatedAlbums.findIndex((review) => review.Album_ID === a.id);
      const bIndex = topRatedAlbums.findIndex((review) => review.Album_ID === b.id);
      return aIndex - bIndex;
    });

    return response.json({
      recents: recentImages,
      reviewed: reviewedImages,
      topRated: topRatedImages
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


module.exports = router;
