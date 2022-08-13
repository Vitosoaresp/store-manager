const salesProductsServices = require('../services/salesProductsServices');

const create = async (req, res) => {
  const { message, code, data } = await salesProductsServices.create(req.body);
  if (message) {
    return res.status(code).json({ message });
  }
  return res.status(code).json(data);
};

module.exports = { create };