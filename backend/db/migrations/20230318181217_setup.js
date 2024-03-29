exports.up = async knex => {
    await knex.schema.createTable("users", (table) => {
        table.increments("id");
        table.string("User_ID");
        table.string("password_hash");
        table.string("username");
    }
    ),
        await knex.schema.createTable("reviews", (table) => {
          table.increments("id");
          table.string("User_ID");
          table.string("content_ID");
          table.string("Review");
          table.int("rating");
        }),
          await knex.schema.createTable("lookUp", (table) => {
            table.increments("id");
            table.string("User_ID");
            table.foreign("User_ID").references("users.User_ID");
            table.string("content_ID");
            table.foreign("content_ID").references("reviews.content_ID");
          });
};

exports.down = async knex => {
    await knex.schema.dropTableIfExists("users")
};
