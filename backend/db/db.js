const dbEngine = "development"
const config = require("../knexfile")[dbEngine]

module.exports = require("knex")(config)