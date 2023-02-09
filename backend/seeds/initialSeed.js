
exports.seed = async knex => {
  await knex('users').del()
  await knex('users').insert([
    { username: 'Keegan', password_hash: "keegs_password" },
    { username: 'Bobby', password_hash: "bobbert_password" },
    { username: 'Kirk', password_hash: "kirkypoo_password" },
  ]);
};