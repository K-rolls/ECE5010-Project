const axios = require('axios');

// Define the search "abstract" interface
class SearchStrategy {
    constructor(query, page = 0) {
        this.q = query;
        this.page = page;
    }

    async search() {
        try {
            const token = await this.getSpotifyToken();
            const searchResults = await this.searchSpotify(token);
            return searchResults;
        } catch (error) {
            if (error.response) {
                console.error('Error:', error.response.status, error.response.data);
                return error;
            } else if (error.request) {
                console.error('Error:', error.request);
                return error
            } else {
                console.error('Error:', error.message);
            }
            return null;
        }
    }

    async getSpotifyToken() {
        const client_id = '01c778890a1a46348091aa2b929d8a2f';
        const client_secret = '81e7861416dd4463b1053da21d575f8b';

        const authOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'grant_type=client_credentials'
        };

        try {
            const tokenResponse = await axios('https://accounts.spotify.com/api/token', authOptions);
            const { access_token } = tokenResponse.data;
            return access_token;
        } catch (error) {
            console.error('Error retrieving Spotify token:', error);
            return null;
        }
    }

    async searchSpotify(token) { }
}

// Concrete implementation of the search strategy for searching albums
class AlbumSearchStrategy extends SearchStrategy {
    constructor(query, page = 0) {
        super(query, page);
        this.type = 'album';
    }

    async searchSpotify(token) {
        console.log(`Searching for ${this.q}...`);
        const searchOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                q: this.q,
                type: this.type,
                limit: 20,
                market: 'CA',
                offset: this.page * 20
            }
        };
        try {
            const searchResponse = await axios('https://api.spotify.com/v1/search', searchOptions);
            const { albums: { items } } = searchResponse.data;
            const searchResults = items.map((item) => ({
              id: item.id,
              name: item.name,
              artists: item.artists.map((artist) => artist.name).join(", "),
              image: item.images[0]?.url,
              releaseDate: item.release_date,
            }));

            return searchResults;
        } catch (error) {
            if (error.response) {
                console.error('Error:', error.response.status, error.response.data);
                return error;
            } else if (error.request) {
                console.error('Error:', error.request);
                return error
            } else {
                console.error('Error:', error.message);
            }
            return null;
        }
    }
}

// Concrete implementation of the search strategy for searching artists
class ArtistSearchStrategy extends SearchStrategy {
    constructor(query, page = 0) {
        super(query, page);
        this.q = query;
        this.page = 0;
        this.type = 'artist';
    }

    async searchSpotify(token) {
        console.log(`Searching for Artists relating to ${this.q}...`);
        const searchOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                q: this.q,
                type: this.type,
                limit: 20,
                market: 'CA',
                offset: this.page * 20
            }
        };
        try {
            const searchResponse = await axios('https://api.spotify.com/v1/search', searchOptions);
            const { artists: { items } } = searchResponse.data;
            const searchResults = items.map(item => ({
                id: item.id,
                name: item.name,
                genres: item.genres,
                image: item.images[0]?.url,
                popularity: item.popularity,
                followers: item.followers.total
            }));

            return searchResults;
        } catch (error) {
            console.error('Error searching for artists:', error);
            return null;
        }
    }
}

// The Search class acts as a wrapper around the search strategy, and allows clients to switch between album and artist search strategies dynamically
module.exports = class Search {
    constructor(query, type, page = 0) {
        this.q = query;
        this.page = page;
        this.type = type
    }
}

module.exports = {
    SearchStrategy,
    AlbumSearchStrategy,
    ArtistSearchStrategy
}
