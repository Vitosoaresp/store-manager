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

const validateBody = async (data) => {
  if (data.find((sale) => sale.productId === undefined)) {
    return { code: 400, message: '"productId" is required' };
  }
  if (data.find((sale) => sale.quantity === undefined)) {
    return { code: 400, message: '"quantity" is required' };
  }
  if (data.find((sale) => sale.quantity < 1)) {
    return { code: 422, message: '"quantity" must be greater than or equal to 1' };
  }
  const invalidProducts = await isInvalidProduct(data);
  if (invalidProducts.includes(undefined)) {
    return { code: 404, message: 'Product not found' };
  }
  return { status: true };
};

const create = async (sales) => {
  const { code, status, message } = await validateBody(sales);
  if (!status) {
    return { code, message };
  }
  const saleId = await salesModels.create();
  await Promise.all(sales.map(
    ({ quantity, productId }) => salesProuctsModels.create({ saleId, quantity, productId }),
  ));
  return { code: 201, data: { id: saleId, itemsSold: sales } };
};

const update = async ({ id }, sales) => {
  const { code, status, message } = await validateBody(sales);
  if (!status) {
    return { code, message };
  }
  const existingSale = await salesProuctsModels.getById({ id });
  if (existingSale.length === 0 || existingSale === undefined) {
    return { code: 404, message: 'Sale not found' };
  }
  await Promise.all(sales.map((sale) => salesProuctsModels.update({ id, ...sale })));
  return { code: 200, data: { saleId: id, itemsUpdated: sales } };
};

const deleteSale = async ({ id }) => {
  const sale = await salesModels.getById({ id });
  if (sale.length === 0) {
    return { code: 404, message: 'Sale not found' };
  }
  await salesModels.deleteSale({ id });
  return { code: 204 };
};

module.exports = { create, getAll, getById, deleteSale, update };