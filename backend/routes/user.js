const express = require("express")
const router = express.Router()
const database = require("../db/db.js")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const axios = require('axios')
const spotify = require('../spotify/spotify.js');
const { v3: uuidv3 } = require('uuid');

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
        return response.send({ token });
    } catch (error) {
        return response.status(500).send(error.message);
    }
});

router.post("/signUp", (request, response) => {
    const { user } = request.body;
    const namespace = '666f849c-326f-4922-8252-c97cef969af5';
    const user_id = uuidv3(user.username, namespace);

    bcrypt.hash(user.password, 12)
        .then(hashed_password => {
            database("users")
                .where({ username: user.username })
                .first()
                .then(existingUser => {
                    if (existingUser) {
                        // User with the same username already exists
                        return response.status(409).json({ error: 'Username already taken' });
                    } else {
                        return database("users")
                            .insert({
                                user_id: user_id,
                                username: user.username,
                                password_hash: hashed_password
                            })
                            .returning("*")
                            .then(users => {
                                const user = users[0]
                                return response.json({ user })
                            }).catch(error => {
                                return response.json({ error: error.message })
                            })
                    }
                })
        })
});


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
            return response.json(result);
        })
        .catch(error => {
            return response.json({ message: error.message });
        });
});


function authenticate(request, response, next) {
    const token = request.headers.authorization
    const secret = "SECRET"
    jwt.verify(token, secret, (error, payload) => {
        if (error) {
            console.error(error);
            return response.json({ message: "sign in error!" });
        }
        database("users")
            .where({ username: payload.username })
            .first()
            .then(user => {
                request.user = user
                next()
            }).catch(error => {
                return response.json({ message: error.message })
            })
    })
}

router.get('/welcome', authenticate, (request, response) => {
    return response.json({ message: `Welcome ${request.user.username}!` })
})

////? tests
// async function login(username, password) {
//     try {
//         const response = await fetch('http://localhost:5000/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ user: { username, password } })
//         });

//         const contentType = response.headers.get('content-type');
//         if (!contentType || !contentType.includes('application/json')) {
//             throw new TypeError("Response wasn't JSON");
//         }

//         const data = await response.json();

//         if (!response.ok) {
//             throw new Error(data.message || 'Unable to login');
//         }

//         return data;
//     } catch (error) {
//         console.error(error);
//         return { error: error.message };
//     }
// }

// async function getWelcomeMessage(token) {
//     try {
//         const response = await fetch('http://localhost:5000/welcome', {
//             headers: {
//                 'Authorization': `${token}`
//             }
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             throw new Error(data.message || 'Unable to get welcome message');
//         }

//         return data.message;
//     } catch (error) {
//         console.error(error);
//         return { error: error.message };
//     }
// }

// login('Moe', 'password123')
//     .then(data => {
//         if (data.error) {
//             console.error(data.error);
//         } else {
//             console.log(data.token); // logged in successfully!
//             getWelcomeMessage(data.token).then(message => {
//                 console.log(message);
//             })
//         }
//     });
