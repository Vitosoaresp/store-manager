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

const update = async (req, res) => {
  const { id } = req.params;
  const { code, message, data } = await salesProductsServices.update({ id }, req.body);
  if (message) {
    return res.status(code).json({ message });
  }
  return res.status(code).json(data);
};

const deleteSale = async (req, res) => {
  const { code, message } = await salesProductsServices.deleteSale(req.params);
  if (message) {
    return res.status(code).json({ message });
  }
  return res.status(code).end();
};

module.exports = { create, getAll, getById, deleteSale, update };