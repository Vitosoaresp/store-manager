const salesModels = require('../models/salesModels');
const salesProuctsModels = require('../models/salesProductsModels');
const productServices = require('./productServices');

const getAll = async () => {
  const sales = await salesProuctsModels.getAll();
  return { code: 200, data: sales };
};

const getById = async ({ id }) => {
  const sales = await salesProuctsModels.getById({ id });

  if (sales.length === 0) {
    return { code: 404, message: 'Sale not found' };
  }

  return { code: 200, data: sales };
};

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

const deleteSale = async ({ id }) => {
  const sale = await salesModels.getById({ id });
  if (sale.length === 0) {
    return { code: 404, message: 'Sale not found' };
  }
  await salesModels.deleteSale({ id });
  return { code: 204 };
};

module.exports = { create, getAll, getById, deleteSale };