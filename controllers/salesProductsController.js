const salesProductsServices = require('../services/salesProductsServices');

const getAll = async (req, res) => {
  const { code, data } = await salesProductsServices.getAll();
  return res.status(code).json(data);
};

const getById = async (req, res) => {
  const { code, data, message } = await salesProductsServices.getById(req.params);
  if (message) {
    return res.status(code).json({ message });
  }
  return res.status(code).json(data);
};

const create = async (req, res) => {
  const { message, code, data } = await salesProductsServices.create(req.body);
  if (message) {
    return res.status(code).json({ message });
  }
  return res.status(code).json(data);
};

module.exports = { create, getAll, getById };