
exports.seed = async knex => {
  await knex('users').del()
  await knex('users').insert([
    { username: 'Keegan', password_hash: "$2b$12$chV2Z1d4bgJl8BuysDQVa.Kc3aX.ocdYGAqqCJmkuFR1MVRIbbYPe" },
    { username: 'Bob', password_hash: "$2b$12$chV2Z1d4bgJl8BuysDQVa.Kc3aX.ocdYGAqqCJmkuFR1MVRIbbYPe" },
    { username: 'Kirk', password_hash: "$2b$12$chV2Z1d4bgJl8BuysDQVa.Kc3aX.ocdYGAqqCJmkuFR1MVRIbbYPe" },
  ]);
};