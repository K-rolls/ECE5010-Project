const database = require("../db/db.js")
const querystring = require('node:querystring');

var client_id = '01c778890a1a46348091aa2b929d8a2f'; // Your client id
var client_secret = '81e7861416dd4463b1053da21d575f8b'; // Your secret
var stateKey = 'spotify_auth_state';
var redirect_uri = 'http://localhost:5000/welcome'

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

function loginToSpotify(request, response, next) {
    var state = generateRandomString(16);
    response.cookie(stateKey, state);

    var scope = 'user-read-private user-read-email';
    response.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
    next();
}

function spotifyCallback(request, response, user) {
    console.log('works')
    // your application requests refresh and access tokens
    // after checking the state parameter
    var username = user.username;
    var code = request.query.code || null;
    var state = request.query.state || null;
    var storedState = request.cookies ? request.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        response.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        response.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {

                var access_token = body.access_token,
                    refresh_token = body.refresh_token;

                // add refresh and access token to database
                database("users")
                    .where({ username: username })
                    .first()
                    .then(retrievedUser => {
                        if (!retrievedUser) throw new Error("user not found!")
                    }).insert({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }).returning("*")
                    .then(users => {
                        const user = users[0]
                        response.json({ user })
                    }).catch(error => {
                        response.json({ error: error.message })
                    })

                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function (error, response, body) {
                    console.log(body);
                });

                // we can also pass the token to the browser to make requests from there
                response.redirect('/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                response.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
}

function getRefreshToken(request, result, next) {
    // requesting access token from refresh token
    var refresh_token = request.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            response.send({
                'access_token': access_token
            });
        }
    });
}

exports.spotifyCallback = spotifyCallback;
exports.getRefreshToken = getRefreshToken;
exports.loginToSpotify = loginToSpotify;