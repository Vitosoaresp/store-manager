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

const getByQuery = async (req, res) => {
  const { code, data } = await productServices.getByQuery(req.query);
  return res.status(code).json(data);
};

const create = async (req, res) => {
  const { code, data, message } = await productServices.create(req.body);
  if (message) {
    return res.status(code).json({ message });
  }
  return res.status(code).json(data);
};

const update = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { code, data, message } = await productServices.update({ id, name });
  if (message) {
    return res.status(code).json({ message });
  }
  return res.status(code).json(data);
};

const deleteProduct = async (req, res) => {
  const { code, message } = await productServices.deleteProduct(req.params);
  if (message) {
    return res.status(code).json({ message });
  }
  return res.status(code).end();
};

module.exports = { getAll, getById, create, update, deleteProduct, getByQuery };
