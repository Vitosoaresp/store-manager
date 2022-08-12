const productServices = require('../services/productServices');

const getAll = async (req, res) => {
  const { code, data } = await productServices.getAll();
  return res.status(code).json(data);
};

const getById = async (req, res) => {
  const { code, data, message } = await productServices.getById(req.params);

  if (message) {
    return res.status(code).json({ message });
  }

  return res.status(code).json(data);
};

const create = async (req, res) => {
  const { code, data, message } = await productServices.create(req.body);
  if (message) {
    return res.status(code).json({ message });
  }
  return res.status(code).json(data);
};

module.exports = { getAll, getById, create };
