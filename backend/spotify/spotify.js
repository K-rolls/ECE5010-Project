const index = require("../index.js");

const database = require("../db/db.js");
const router = require("../routes/user.js");

// Route to search for tracks on Spotify
// router.get("/spotify/search", async (req, res) => {
//   const { q } = req.query;
//   const token = await getSpotifyToken();
//   const searchResults = await searchSpotifyTracks(q, token);

//   res.json(searchResults);
// });

// Helper function to retrieve a Spotify token
async function getSpotifyToken() {
  const client_id = "01c778890a1a46348091aa2b929d8a2f"; // Your client id
  const client_secret = "81e7861416dd4463b1053da21d575f8b"; // Your secret

  const authOptions = {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        new Buffer.from(client_id + ":" + client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: "grant_type=client_credentials",
  };

  try {
    const tokenResponse = await axios(
      "https://accounts.spotify.com/api/token",
      authOptions
    );
    const data = tokenResponse.data;
    const token = data.access_token;
    return token;
  } catch (error) {
    console.error("Error retrieving Spotify token:", error);
    return null;
  }
}

// Helper function to search for tracks on Spotify
// async function searchSpotifyTracks(query, token) {
//   const searchOptions = {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     params: {
//       q: query,
//       type: "track",
//       limit: 10,
//     },
//   };

//   try {
//     const searchResponse = await axios(
//       "https://api.spotify.com/v1/search",
//       searchOptions
//     );
//     const data = searchResponse.data;
//     const searchResults = data.tracks.items.map((item) => ({
//       id: item.id,
//       name: item.name,
//       artists: item.artists.map((artist) => artist.name).join(", "),
//       album: item.album.name,
//       image: item.album.images[0].url,
//     }));
//     return searchResults;
//   } catch (error) {
//     console.error("Error searching Spotify tracks:", error);
//     return null;
//   }
// }
