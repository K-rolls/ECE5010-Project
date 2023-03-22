const axios = require('axios');
const express = require("express");
const router = express.Router();
class Search {
    constructor(query) {
        this.query = query;
    }

    async search() {
        const token = await this.getSpotifyToken();
        const q = this.query.makeQuery()
        const searchResults = await this.searchSpotifyAlbum(q, token);
        return searchResults;
    }

    async getSpotifyToken() {
        const client_id = '01c778890a1a46348091aa2b929d8a2f'; // Your client id
        const client_secret = '81e7861416dd4463b1053da21d575f8b'; // Your secret

        const authOptions = {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'grant_type=client_credentials'
        };

        try {
            const tokenResponse = await axios('https://accounts.spotify.com/api/token', authOptions);
            const data = tokenResponse.data;
            const token = data.access_token;
            return token;
        } catch (error) {
            console.error('Error retrieving Spotify token:', error);
            return null;
        }
    }

    async searchSpotifyAlbum(query, token) {
        console.log(query);
        const searchOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                q: query,
                type: 'album',
                limit: 10,
                market: 'CA',
                offset: this.query.getPage() * 10
            }
        };

        try {
            const searchResponse = await axios('https://api.spotify.com/v1/search', searchOptions);
            const data = searchResponse.data;
            const searchResults = data.albums.items.map(item => ({
                id: item.id,
                name: item.name,
                artists: item.artists.map(artist => artist.name).join(', '),
                image: item.images[0]?.url,
                releaseDate: item.release_date
            }));

            return searchResults;
        } catch (error) {
            console.error('Error searching Spotify tracks:', error);
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
                decade = '';
        }

        if ((q == null) && (decade == null)) {
            console.log("Bad search query");
        } else if ((q == null) && !(decade == null)) {
            this.q = decade;
        } else if (!(q == null) && (decade == null)) {
            this.q = q
        } else {
            this.q = q + "%20" + decade
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

// // Example usage:
// const query = new Query(null, 4, 1);
// const search = new Search(query);
// search.search()
//     .then(searchResults => {
//         console.log(searchResults);
//     })
//     .catch(error => {
//         console.error(error);
//     });

router.get('/spotify/search', (request, response) => {
    return response.json({ message: `Welcome ${request.user.username}!` })
})