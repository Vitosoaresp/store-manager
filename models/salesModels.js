const connection = require('./connection');

const create = async () => {
  const query = 'INSERT INTO StoreManager.sales VALUES ()';
  const [{ insertId }] = await connection.execute(query);
  return insertId;
};

module.exports = { create };