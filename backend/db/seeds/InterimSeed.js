const knex = require("knex");
const sqlite3 = require("sqlite3");
const fs = require("fs");

const db = knex({
  client: "sqlite3",
  connection: {
    filename: "../ECE5010-projectdb.db3",
  },
});

exports.seed = async (knex) => {
  // Get the data from the users table
  const users = await knex.select().from("users");

  // Update each user to add a profile picture
  const updatedUsers = users.map((user) => {
    return {
      ...user,
      profilePicture: "../backend/uploads/default-profile-picture.png",
    };
  });

  // Update the users table with the new data
  await knex("users").truncate();
  await knex.batchInsert("users", updatedUsers, 100);
};

//!! TO RUN:
//knex seed:run --env development --specific=InterimSeed.js
