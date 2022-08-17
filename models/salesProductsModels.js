const connection = require('./connection');

const getAll = async () => {
  const [rows] = await connection.execute(
    `SELECT id AS saleId, product_id AS productId, date, quantity
    FROM StoreManager.sales_products
    INNER JOIN StoreManager.sales
    ON StoreManager.sales_products.sale_id = StoreManager.sales.id
    ORDER BY sale_id, product_id`,
  );
  return rows;
};

const getById = async ({ id }) => {
  const [rows] = await connection.execute(
    `SELECT product_id AS productId, date, quantity
    FROM StoreManager.sales
    JOIN StoreManager.sales_products
    ON StoreManager.sales_products.sale_id = StoreManager.sales.id
    WHERE StoreManager.sales.id = ?`,
    [id],
  );
  return rows;
};

const create = async ({ saleId, productId, quantity }) => {
  await connection.execute(
    'INSERT INTO StoreManager.sales_products (sale_id, product_id, quantity) VALUES (?, ?, ?)',
    [saleId, productId, quantity],
  );
  return true;
};

const update = async ({ id, productId, quantity }) => {
  await connection.execute(
    `UPDATE StoreManager.sales_products
    SET quantity = ?, product_id = ?
    WHERE sale_id = ? AND product_id = ?`,
    [quantity, productId, id, productId],
  );
  return true;
};

module.exports = { create, getAll, getById, update };
