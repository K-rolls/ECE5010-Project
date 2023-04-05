const express = require("express");
const router = express.Router();
const database = require("../db/db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { v3: uuidv3 } = require("uuid");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, path.resolve(__dirname, "../uploads/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const parsed = path.parse(file.originalname);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// https://stackoverflow.com/questions/3748/storing-images-in-db-yea-or-nay
router.post(
  "/setProfilePic",
  upload.single("profilePic"),
  async (request, res) => {
    try {
      const { userId } = request.body.User_ID;
      console.log(userId);
      const existingUser = await database("users").where({
        User_ID: request.body.User_ID,
      });
      console.log(existingUser);
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const profilePicturePath = request.file.path;
      const parsed = path.parse(profilePicturePath);
      const filename = parsed.name;
      const newFilePath = `../backend/uploads/${filename}.webp`;

      const result = await database("users")
        .where({ User_ID: request.body.User_ID })
        .update({ profilePicture: newFilePath }, [
          "User_ID",
          "username",
          "profilePicture",
        ]);
      console.log(result);
      return res.json({ user: result[0] });
    } catch (error) {
      return res.json({ error: error.message });
    }
  }
);

router.post("/signUp", async (request, response) => {
  try {
    const { user } = request.body;
    const namespace = "666f849c-326f-4922-8252-c97cef969af5";
    const user_id = uuidv3(user.username, namespace);

    const existingUser = await database("users")
      .where({ username: user.username })
      .first();
    if (existingUser) {
      return response.status(409).json({ error: "Username already taken" });
    }

    const hashed_password = await bcrypt.hash(user.password, 12);
    const users = await database("users")
      .insert({
        User_ID: user_id,
        username: user.username,
        password_hash: hashed_password,
        profilePicture: "../uploads/default-profile-picture.png",
      })
      .returning("*");

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
      if (!areSamePasswords) throw new Error("wrong Password!");
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
          if (error) reject(new Error("Sign in error!"));
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

async function isAlbum(albumId) {
  try {
    const albumDataResponse = await axios.post(
      "http://localhost:5000/spotify/getAlbums",
      { Reviewed: [albumId] }
    );
    return true;
  } catch (error) {
    return false;
  }
}

router.post("/makeReview", async (request, response) => {
  try {
    const { token, albumID, review, rating } = request.body;
    const decodedToken = jwt.decode(token);
    const userID = decodedToken ? decodedToken.User_ID : null;

    await database.transaction(async (trx) => {
      const existingRow = await database("lookUp")
        .select("User_ID", "content_ID")
        .where({
          User_ID: userID,
          content_ID: albumID,
        })
        .first()
        .transacting(trx);
      console.log(existingRow);
      const isEntryAlbum = await isAlbum(albumID);
      console.log(isEntryAlbum);

      if (existingRow) {
        if (isEntryAlbum) {
          await database("reviews")
            .where({
              User_ID: userID,
              content_ID: albumID,
            })
            .update({
              review: review,
              rating: rating,
            })
            .transacting(trx);
        } else {
          await database("reviews")
            .where({
              User_ID: userID,
              content_ID: albumID,
            })
            .update({
              review: review,
              rating: rating,
            })
            .transacting(trx);
        } 

        return response.json({
          success: true,
          message: "Review updated successfully",
        });
      } else {
        if (isEntryAlbum) {
          await database("lookUp")
            .insert({
              User_ID: userID,
              content_ID: albumID,
              isAlbum: 1,
            })
            .transacting(trx);
        } else {
          await database("lookUp")
            .insert({
              User_ID: userID,
              content_ID: albumID,
              isAlbum: 0,
            })
            .transacting(trx);
        }  
        await database("reviews")
          .insert({
            User_ID: userID,
            content_ID: albumID,
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

// Helper function to format a review object
function formatReview(review, imagesById) {
  const isAlbum = review.isAlbum === 1;
  const contentKey = isAlbum ? 'album' : 'artist';
  return {
    id: review.content_ID,
    type: contentKey,
    name: review[contentKey + '_name'],
    image: imagesById[review.content_ID],
    rating: review.rating
  };
}

router.post('/getReviewed', async (request, response) => {
  const { token } = request.body;
  const decodedToken = jwt.decode(token);
  const uuid = decodedToken?.User_ID || null;

  try {
    const allReviews = await database('reviews')
      .select('*')
      .where({ 'reviews.User_ID': uuid })
      .join('lookUp', 'lookUp.content_ID', 'reviews.content_ID')
      .select('lookUp.isAlbum')
      .orderBy('reviews.id', 'desc');
    // return response.json(allReviews);

    // recently reviewed content
    const recents = allReviews.filter((review) => review.User_ID === uuid).slice(0, 4).map((review) => ({ content_ID: review.content_ID, isAlbum: review.isAlbum }));

    const reviewedAlbums = allReviews.filter((review) => review.isAlbum === 1 && review.User_ID === uuid);
    const reviewedArtists = allReviews.filter((review) => review.isAlbum === 0 && review.User_ID === uuid);

    const albumIds = allReviews.filter((review) => review.isAlbum === 1 && review.User_ID === uuid)
      .map((review) => review.content_ID);
    const artistIds = allReviews.filter((review) => review.isAlbum === 0 && review.User_ID === uuid)
      .map((review) => review.content_ID);

    let albumData = [];
    let artistData = [];
    let recentData = [];

    if (albumIds.length > 0) {
      const albumDataResponse = await axios.post('http://localhost:5000/spotify/getAlbums', { Reviewed: albumIds });
      albumData.push(...albumDataResponse.data.slice(1));
    }

    if (artistIds.length > 0) {
      const artistDataResponse = await axios.post('http://localhost:5000/spotify/getArtist', { Reviewed: artistIds });
      artistData.push(...artistDataResponse.data.slice(1));
    }

    const albumReviewData = albumData.map((item) => ({
      image: item.image,
      content_ID: item.id,
      review: reviewedAlbums.find((review) => review.content_ID === item.id)
    })).sort((a, b) => b.review.id - a.review.id).sort((a, b) => b.review.rating - a.review.rating)
      .slice(0, 4);

    const artistReviewData = artistData.map((item) => ({
      image: item.image,
      content_ID: item.id,
      review: reviewedArtists.find((review) => review.content_ID === item.id)

    })).sort((a, b) => b.review.id - a.review.id).sort((a, b) => b.review.rating - a.review.rating)
      .slice(0, 4);

    for (var i = 0; i < recents.length; i++) {
      // console.log(recents[i].isAlbum);
      if (recents[i].isAlbum === 1) {
        const albumDataResponse = await axios.post('http://localhost:5000/spotify/getAlbums', { Reviewed: [recents[i].content_ID] });
        recentData.push(albumDataResponse.data.slice(1));
      } else if (recents[i].isAlbum === 0) {
        const artistDataResponse = await axios.post('http://localhost:5000/spotify/getArtist', { Reviewed: [recents[i].content_ID] });
        recentData.push(artistDataResponse.data.slice(1));
      }
    }

    const recentDataWithImageAndID = recentData.map((item) => ({
      image: item[0].image,
      content_ID: item[0].id,
    }));

    const userReviews = allReviews.filter((review) => review.User_ID === uuid)

    const allReviewData = userReviews.map((item) => ({
      content_ID: item.content_ID,
      id: item.id,
      isAlbum: item.isAlbum,
    }));
    // console.log(allReviewData);
    // Match content_ID to image from album or artist list above

    const albumReviewDataWithImage = allReviewData.filter(item => item.isAlbum === 1).map(item => {

      const albumFound = albumData.find(album => album.id === item.content_ID);
      return {
        content_ID: item.content_ID,
        image: albumFound?.image,
        id: item.id,
        isAlbum: item.isAlbum,
      }
    });

    const artistReviewDataWithImage = allReviewData.filter(item => item.isAlbum === 0).map(item => {
      const artist = artistData.find(artist => artist.id === item.content_ID);
      return {
        content_ID: item.content_ID,
        image: artist?.image,
        id: item.id,
        isAlbum: item.isAlbum,
      }
    });
    const reviewed = albumReviewDataWithImage.concat(artistReviewDataWithImage);
    const sortedReviewed = reviewed.sort((a, b) => b.id - a.id);

    return response.json({
      recentDataWithImageAndID,
      albumReviewData,
      artistReviewData,
      sortedReviewed
    });

  } catch (error) {
    console.error(error);
    return response.json({
      success: false,
      message: "Internal server error",
      error: error.message,
      data: error,
    });
  }
});

// gets all reviews and their associated album data
router.post("/getAllReviews", async (request, response) => {
  try {
    const numReviews = request.body.num;
    const offset = numReviews > 0 ? (numReviews - 1) * 10 : 0;
    const countResult = await database("reviews").count("id as count").first();
    const count = countResult.count;
    if (offset >= count) {
      // The requested offset exceeds the number of entries in the database
      return response.json({
        success: false,
        error: "Requested offset exceeds the number of entries in the database",
      });
    }

    // Retrieve all reviews
    const content_IDs = await database("lookUp")
      .select("*")
      .orderByRaw("id DESC")
      .limit(10)
      .offset(offset);
    // console.log(reviews);

    // Extract album and artist IDs from reviews
    const albumIds = content_IDs.filter(review => review.isAlbum).map(review => review.content_ID);
    const artistIds = content_IDs.filter(review => !review.isAlbum).map(review => review.content_ID);

    // Make batch requests for album and artist data
    let albumData = [];
    let artistData = [];

    if (albumIds.length > 0) {
      const albumDataResponse = await axios.post(
        "http://localhost:5000/spotify/getAlbums",
        { Reviewed: albumIds }
      );
      albumData = albumDataResponse.data.slice(1);
    }

    if (artistIds.length > 0) {
      const artistDataResponse = await axios.post(
        "http://localhost:5000/spotify/getArtist",
        { Reviewed: artistIds }
      );
      artistData = artistDataResponse.data;
    }

    // Combine review, rating, and album/artist data
    const allReviewData = await Promise.all(content_IDs.map(async review => {
      const user = await database("users")
        .select("username")
        .where({ User_ID: review.User_ID })
        .first();
      const username = user ? user.username : "unknown";

      let contentData;
      if (review.isAlbum) {
        contentData = albumData.find(album => album.id === review.content_ID);
        const contentReviewData = await database("reviews")
          .select("Review", "rating")
          .where({ content_ID: review.content_ID, User_ID: review.User_ID });

        return {
          ...review,
          album: review.isAlbum ? contentData : null,
          username,
          review: contentReviewData.length > 0 ? contentReviewData[0].Review : null,
          rating: contentReviewData.length > 0 ? contentReviewData[0].rating : null,
        }
      } else {
        contentData = artistData.find(artist => artist.id === review.content_ID);
        const contentReviewData = await database("reviews")
          .select("Review", "rating")
          .where({ content_ID: review.content_ID }, { User_ID: review.User_ID });
        return {
          ...review,
          artist: !review.isAlbum ? contentData : null,
          username,
          review: contentReviewData.length > 0 ? contentReviewData[0].Review : null,
          rating: contentReviewData.length > 0 ? contentReviewData[0].rating : null,
        }
      }
    }));

    return response.json(allReviewData);
  } catch (error) {
    return response.json({ error: error.message });
  }
});

router.get("/getProfilePic", async (req, res) => {
  try {
    const { User_ID } = req.query;
    console.log(User_ID);
    if (!User_ID) {
      return res.status(409).json({ error: "User_ID not supplied" });
    }

    const user = await database("users")
      .select("username", "profilePicture")
      .where({ User_ID })
      .first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const profilePicturePath = user.profilePicture;
    const fileName = path.basename(
      profilePicturePath,
      path.extname(profilePicturePath)
    );
    const defaultPath = "../backend/uploads/default-profile-picture.png";

    const filePath = fileName
      ? `../backend/uploads/${fileName}${path.extname(profilePicturePath)}`
      : defaultPath;

    try {
      if (fs.existsSync(filePath)) {
        return res.json({ profilePicture: filePath });
      } else {
        // File doesn't exist
      }
    } catch (error) {
      console.error(error);
    }
    return res.json({ profilePicture: filePath });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

module.exports = router;
