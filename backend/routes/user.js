const express = require("express")
const router = express.Router()
const database = require("../db/db.js")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const axios = require('axios')
// const request = require('request')
const spotify = require('../spotify/spotify.js');

module.exports = router;

router.get('/spotify/token', async (request, response) => {
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
        response.send({ token });
    } catch (error) {
        response.status(500).send(error.message);
    }
});

router.post("/signUp", (request, response) => {
    const { user } = request.body
    bcrypt.hash(user.password, 12)
        .then(hashed_password => {
            database("users")
                .insert({
                    username: user.username,
                    password_hash: hashed_password
                })
                .returning("*")
                .then(users => {
                    const user = users[0]
                    response.json({ user })
                }).catch(error => {
                    response.json({ error: error.message })
                })
        })
    spotify.spotifyCallback(request, response, user)
})

router.post("/login", (request, response) => {
    const { user } = request.body
    database("users")
        .where({ username: user.username })
        .first()
        .then(retrievedUser => {
            if (!retrievedUser) throw new Error("user not found!")
            return Promise.all([
                bcrypt.compare(user.password, retrievedUser.password_hash),
                Promise.resolve(retrievedUser)
            ]).then(results => {
                const areSamePasswords = results[0]
                if (!areSamePasswords) throw new Error("wrong Password!")
                const retrievedUser = results[1];
                // console.log(results)
                const payload = { username: retrievedUser.username };
                const secret = "SECRET"
                return new Promise((resolve, reject) => {
                    jwt.sign(payload, secret, (error, token) => {
                        if (error) reject(new Error("Sign in error!"))
                        resolve({ token, user });
                    });
                });
            });
        })
        .then(result => {
            // return the result to the client
            response.json(result);
        })
        .catch(error => {
            response.json({ message: error.message });
        });
});

function authenticate(request, response, next) {
    const token = request.headers.authorization
    const secret = "SECRET"
    jwt.verify(token, secret, (error, payload) => {
        if (error) {
            return response.json({ message: "sign in error!" });
        }
        database("users")
            .where({ username: payload.username })
            .first()
            .then(user => {
                request.user = user
                next()
            }).catch(error => {
                response.json({ message: error.message })
            })
    })
}

router.get('/welcome', authenticate, (request, response) => {
    response.json({ message: `Welcome ${request.user.username}!` })
})
