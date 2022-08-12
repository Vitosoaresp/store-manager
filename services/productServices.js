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

const create = async ({ name }) => {
  if (!name) {
    return { code: 400, message: '"name" is required' };
  }
  if (name.length < 5) {
    return { code: 422, message: '"name" length must be at least 5 characters long' };
  }
  const product = await productModel.create({ name });
  return { code: 201, data: product };
};

module.exports = { getAll, getById, create };
