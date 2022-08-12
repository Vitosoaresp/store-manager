const productModel = require('../models/productModels');

const getAll = async () => {
  const products = await productModel.getAll();

  return { code: 200, data: products };
};

const getById = async ({ id }) => {
  const [product] = await productModel.getById({ id });

  if (!product) {
    return { code: 404, message: 'Product not found' };
  }
  return { code: 200, data: product };
};

module.exports = { getAll, getById };
