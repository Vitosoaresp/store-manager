const connection = require('./connection');

const getById = async ({ id }) => {
  const [rows] = await connection.execute(
    'SELECT * FROM StoreManager.sales WHERE id = ?',
    [id],
  );
  return rows;
};

const create = async () => {
  const query = 'INSERT INTO StoreManager.sales VALUES ()';
  const [{ insertId }] = await connection.execute(query);
  return insertId;
};

const deleteSale = async ({ id }) => {
  const query = 'DELETE FROM StoreManager.sales WHERE id = ?';
  await connection.execute(query, [id]);
  return true;
};

module.exports = { create, deleteSale, getById };