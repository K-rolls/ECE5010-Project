const axios = require("axios");
const express = require("express");
const router = express.Router();
const database = require("../db/db.js");

class Search {
  constructor(query) {
    this.query = query;
  }

  async search() {
    const token = await this.getSpotifyToken();
    const q = this.query.makeQuery();
    const searchResults = await this.searchSpotifyAlbum(q, token);
    return searchResults;
  }

  async getSpotifyToken() {
    const client_id = "285835dbab1546fa8f45b13521cc5506";
    const client_secret = "918e2614bbfb4983830528e84d22d9dc";

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

  async searchSpotifyAlbum(query, token) {
    const searchOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        q: query,
        type: "album",
        limit: 20, //! can be changed to fill site
        market: "CA",
        offset: this.query.getPage() * 20,
      },
    };

    try {
      const searchResponse = await axios(
        "https://api.spotify.com/v1/search",
        searchOptions
      );
      const data = searchResponse.data;
      const searchResults = data.albums.items.map((item) => ({
        id: item.id,
        name: item.name,
        artists: item.artists.map((artist) => artist.name).join(", "),
        image: item.images[0]?.url,
        releaseDate: item.release_date,
      }));

      return searchResults;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }
}

class Query {
  constructor(q, decade = null, page) {
    switch (decade) {
      case 0:
        decade = "year:2020-2029";
        break;
      case 1:
        decade = "year:2010-2019";
        break;
      case 2:
        decade = "year:2000-2009";
        break;
      case 3:
        decade = "year:1990-1999";
        break;
      case 4:
        decade = "year:1980-1989";
        break;
      case 5:
        decade = "year:1970-1979";
        break;
      case 6:
        decade = "year:1960-1969";
        break;
      case 7:
        decade = "year:1950-1959";
        break;
      case 8:
        decade = "year:1940-1949";
        break;
      case 9:
        decade = "year:1930-1939";
        break;
      default:
        decade = "";
    }

    if (q === null && decade === null) {
      console.error("Bad search query");
    } else if (q === null && decade !== null) {
      console.log("q is null");
      this.q = decade;
    } else if (q !== null) {
      console.log("q is not null");
      this.q = q;
    }
    this.page = page;
  }

  makeQuery() {
    return this.q;
  }

  getPage() {
    return this.page;
  }
}
const AlbumQuery = require("./query.js").albumQuery;
const ArtistQuery = require("./query.js").artistQuery;
const SearchStrategy = require("./search.js");
const AlbumSearchStrategy = require("./search.js").AlbumSearchStrategy;
const ArtistSearchStrategy = require("./search.js").ArtistSearchStrategy;

// default route
router.get("/", (request, response) => {
  return response.json({
    "Spotify endpoints": [
      { "/token": "gets the spotify token based on app credentials" },
      {
        "/albumSearch":
          "makes a search call to the spotify API based on a query or decade",
      },
    ],
  });
});

// gets token as a route incase needed
router.get("/token", async (request, response) => {
  const client_id = "285835dbab1546fa8f45b13521cc5506";
  const client_secret = "918e2614bbfb4983830528e84d22d9dc";

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
    return response.send({ token });
  } catch (error) {
    return response.status(500).send(error.message);
  }
});

router.post("/albumSearch", async (request, response) => {
  // Get query parameters from the request
  const { q, decade, page } = request.body;

  // Create a new albumQuery object
  const query = new AlbumQuery(q, decade, page);
  console.log(query);
  const search = new AlbumSearchStrategy(query.q, query.page, query.type);
  search
    .search()
    .then((searchResults) => {
      return response.json(searchResults);
    })
    .catch((error) => {
      console.error(error);
      return response.send(error);
    });
});

router.post("/artistSearch", async (request, response) => {
  // Get query parameters from the request
  const { q, decade, page } = request.body;

  // Create a new ArtistQuery object
  const query = new ArtistQuery(q, decade, page);
  console.log(query.page);
  const search = new ArtistSearchStrategy(query.q, query.type);
  search
    .search()
    .then((searchResults) => {
      return response.json(searchResults);
    })
    .catch((error) => {
      console.error(error);
      return response.send(error);
    });
});

// gets the albums associated with the user
router.post("/getAlbums", async (request, response) => {
  try {
    const indices = Object.values(request.body.Reviewed);
    const len = indices.length;
    const albumIds = indices.join(",");

    const tokenResponse = await axios.get(
      "http://localhost:5000/spotify/token"
    );
    const token = tokenResponse.data.token;

    const albumUrl = `https://api.spotify.com/v1/albums?ids=${albumIds}`;
    const searchOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const albumResponse = await axios.get(albumUrl, searchOptions);
    const albumData = albumResponse.data.albums.map((album) => {
      const {
        name,
        artists,
        id,
        images,
        release_date,
        total_tracks,
        album_type,
        external_urls,
      } = album;
      return {
        name,
        artists: artists.map((artist) => artist.name).join(", "),
        id,
        image: images[0].url,
        releaseDate: release_date,
        numTracks: total_tracks,
        type: album_type,
        spotifyLink: external_urls.spotify,
      };
    });
    albumData.unshift({ len: len });
    return response.json(albumData);
  } catch (error) {
    console.error(error);
    return response.status(500).send(error.message);
  }
});

// gets the albums associated with the user
router.post("/getArtist", async (request, response) => {
  try {
    const indices = Object.values(request.body.Reviewed);
    const len = indices.length;
    const artistIds = indices.join(",");

    const tokenResponse = await axios.get(
      "http://localhost:5000/spotify/token"
    );
    const token = tokenResponse.data.token;

    const artistUrl = `https://api.spotify.com/v1/artists?ids=${artistIds}`;
    const searchOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const artistResponse = await axios.get(artistUrl, searchOptions);
    const artistData = artistResponse.data.artists.map((item) => {
      const { id, name, genres, images, popularity, followers, external_urls } =
        item;
      return {
        id: id,
        name: name,
        genres: genres,
        image: images[0]?.url,
        popularity: popularity,
        followers: followers.total,
        spotifyLink: external_urls.spotify,
      };
    });
    artistData.unshift({ len: len });
    return response.json(artistData);
  } catch (error) {
    console.error(error);
    return response.status(500).send(error.message);
  }
});

router.get("/averageRating", async (request, response) => {
  const albumId = request.headers.album_id;
  const reviews = await database("reviews")
    .select("reviews.*")
    .where({ album_id: albumId })
    .join("users", "reviews.User_ID", "=", "users.User_ID");
  const ratings = reviews.map((review) => review.rating);
  const avgRatings = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  return response.json({
    success: true,
    data: avgRatings,
  });
});

router.get("/getReviews", async (request, response) => {
  const albumId = request.headers.album_id;

  try {
    const reviews = await database("reviews")
      .select("reviews.*", "users.username")
      .where({ album_id: albumId })
      .join("users", "reviews.User_ID", "=", "users.User_ID");

    return response.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
