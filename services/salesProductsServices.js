const salesModels = require('../models/salesModels');
const salesProuctsModels = require('../models/salesProductsModels');
const productServices = require('./productServices');

const isInvalidProduct = async (sales) => {
  const result = [];
  await Promise.all(sales.map((sale) => productServices.getById(
    { id: sale.productId },
  ).then((product) => result.push(product.data))));
  return result;
};

const create = async (sales) => {
  if (sales.find((sale) => sale.productId === undefined)) {
    return { code: 400, message: '"productId" is required' };
  }
  if (sales.find((sale) => sale.quantity === undefined)) {
    return { code: 400, message: '"quantity" is required' };
  }
  if (sales.find((sale) => sale.quantity < 1)) {
    return { code: 422, message: '"quantity" must be greater than or equal to 1' };
  }
  const invalidProducts = await isInvalidProduct(sales);
  if (invalidProducts.includes(undefined)) {
    return { code: 404, message: 'Product not found' };
  }
  const saleId = await salesModels.create();
  await Promise.all(sales.map(
    ({ quantity, productId }) => salesProuctsModels.create({ saleId, quantity, productId }),
  ));
  return { code: 201, data: { id: saleId, itemsSold: sales } };
};

module.exports = { create };