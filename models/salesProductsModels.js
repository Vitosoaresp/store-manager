const connection = require('./connection');

const create = async ({ saleId, productId, quantity }) => {
  await connection.execute(
    'INSERT INTO StoreManager.sales_products (sale_id, product_id, quantity) VALUES (?, ?, ?)',
    [saleId, productId, quantity],
  );
  return true;
};

module.exports = { create };
