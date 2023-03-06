exports.seed = async knex => {
  await knex('users').del()
  await knex('users').insert([
    { username: 'Larry', password_hash: "$2b$12$chV2Z1d4bgJl8BuysDQVa.Kc3aX.ocdYGAqqCJmkuFR1MVRIbbYPe", access_token: "123456789123456789", refresh_token: "123456789123456789" },
    { username: 'Curly', password_hash: "$2b$12$chV2Z1d4bgJl8BuysDQVa.Kc3aX.ocdYGAqqCJmkuFR1MVRIbbYPe", access_token: "123456789123456789", refresh_token: "123456789123456789" },
    { username: 'Moe', password_hash: "$2b$12$chV2Z1d4bgJl8BuysDQVa.Kc3aX.ocdYGAqqCJmkuFR1MVRIbbYPe", access_token: "123456789123456789", refresh_token: "123456789123456789" },
  ]);
};