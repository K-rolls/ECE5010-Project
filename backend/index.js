const express = require('express')
const bodyParser = require("body-parser")
const cors = require('cors')

const app = express();

app.use(bodyParser.json())
app.use(cors())

const port = 5000

app.listen(port, () => console.log(`listening at port ${port}`))