const productModel = require('../models/productModels');

const getAll = async () => {
  const products = await productModel.getAll();

  // if (products.length === 0) {
  //   return [];
  // }

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
