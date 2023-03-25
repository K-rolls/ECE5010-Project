const express = require('express')
const bodyParser = require("body-parser")
const cors = require('cors')

const userRoutes = require('./routes/user.js')
const spotifyRoutes = require('./spotify/spotify.js')

const app = express();

app.use(bodyParser.json())
app.use(cors())

const port = 5000

app.listen(port, () => console.log(`listening at port ${port}`))

app.use("/user", userRoutes)
app.use("/spotify", spotifyRoutes)