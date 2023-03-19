exports.seed = async knex => {
  await knex('users').del()
  await knex('reviews').del()
  await knex('lookUp').del()
  await knex('users').insert([
    { User_ID: '361052fc-c331-3c4c-816d-c939c2e0bc55', username: 'Larry', password_hash: "$2b$12$1Spdg4/VRUAfXduGSeaq8OvH7aNs5iLIfTX7VWek9A20Oyfro4glG" },
    { User_ID: '544027a5-9920-37c4-9ab6-bfea31d227a9', username: 'Curly', password_hash: "$2b$12$1Spdg4/VRUAfXduGSeaq8OvH7aNs5iLIfTX7VWek9A20Oyfro4glG" },
    { User_ID: 'a15584b0-d106-323d-a839-0982c237af42', username: 'Moe', password_hash: "$2b$12$1Spdg4/VRUAfXduGSeaq8OvH7aNs5iLIfTX7VWek9A20Oyfro4glG" }
  ])
  await knex('reviews').insert([
    { User_ID: '361052fc-c331-3c4c-816d-c939c2e0bc55', Album_ID: '2omIeSJEGQeKHPOpiXgfkr', Review: "great album, Amazing sound. really pumps me up!", rating: 8 },
    { User_ID: '544027a5-9920-37c4-9ab6-bfea31d227a9', Album_ID: '2omIeSJEGQeKHPOpiXgfkr', Review: "Amazing album, one of my favourites by Metallica! I really enjoy their music 10/10", rating: 10 },
    { User_ID: 'a15584b0-d106-323d-a839-0982c237af42', Album_ID: '2omIeSJEGQeKHPOpiXgfkr', Review: "I don't understand why everyone likes this album?", rating: 3 }
  ])
  await knex('lookUp').insert([
    { User_ID: '361052fc-c331-3c4c-816d-c939c2e0bc55', Album_ID: '2omIeSJEGQeKHPOpiXgfkr' },
    { User_ID: '544027a5-9920-37c4-9ab6-bfea31d227a9', Album_ID: '2omIeSJEGQeKHPOpiXgfkr' },
    { User_ID: 'a15584b0-d106-323d-a839-0982c237af42', Album_ID: '2omIeSJEGQeKHPOpiXgfkr' }
  ])
};