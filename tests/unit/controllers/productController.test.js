const sinon = require('sinon');
const { expect } = require('chai');
const productServices = require('../../../services/productServices');
const productControllers = require('../../../controllers/productController');

describe('Test controllers products', () => {
  beforeEach(sinon.restore);

  describe('Ao buscar pelos produtos', () => {
    const FAKE_PRODUCTS = [
      { id: 1, name: 'Baby yoda' }, { id: 2, name: 'Darth vader' }, { id: 3, name: 'Luke skywalker' },
    ];
    const FAKE_PRODUCT = { id: 1, name: 'Baby yoda' };
    it('Deve retornar todos os produtos', async () => {
      sinon.stub(productServices, 'getAll').resolves({ code: 200, data: FAKE_PRODUCTS });
      const req = {};
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      await productControllers.getAll(req, res);
      expect(res.status.calledWith(200)).to.be.true;
    });
    it('Deve retornar o produto especifico', async () => {
      sinon.stub(productServices, 'getById').resolves({ code: 200, data: FAKE_PRODUCT });
      const req = { params: { id: 1 } };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      await productControllers.getById(req, res);
      expect(res.status.calledWith(200)).to.be.true;
    });
    it('Deve retornar um erro ao buscar um produto que não existe', async () => {
      sinon.stub(productServices, 'getById').resolves({ code: 404, message: 'Product not found' });
      const req = { params: { id: 999 } };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      await productControllers.getById(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Product not found' })).to.be.true;
    });
  });

  describe('Ao criar um produto', () => {
    const FAKE_PRODUCT = { id: 5, name: 'Baby yoda 2.0' };
    it('Se sucesso deve retornar status 201', async () => {
      sinon.stub(productServices, 'create').resolves({ code: 201, data: FAKE_PRODUCT, message: null });
      const req = { body: { name: 'Baby yoda 2.0' } };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      await productControllers.create(req, res);

      expect(res.status.calledWith(201)).to.be.true;
    });
    it('Se não passado nenhum nome deve retornar status 400', async () => {
      sinon.stub(productServices, 'create').resolves({ code: 400, message: '"name" is required' });
      const req = { body: {} };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      await productControllers.create(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    })
    it('Se passado nome menor que 5 caracteres deve retornar status 422', async () => {
      sinon.stub(productServices, 'create').resolves({ code: 422, message: '"name" length must be at least 5 characters long' });
      const req = { body: { name: 'Baby' } };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      await productControllers.create(req, res);

      expect(res.status.calledWith(422)).to.be.true;
    });
  });

  describe('Ao atualizar um produto', () => {
    const FAKE_PRODUCT = { id: 5, name: 'Baby yoda 2.0' };
    it('Se sucesso deve retornar status 200', async () => {
      sinon.stub(productServices, 'update').resolves({ code: 200, data: FAKE_PRODUCT, message: null });
      const req = { body: { name: 'Baby yoda 2.0' }, params: { id: 5 } };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      await productControllers.update(req, res);

      expect(res.status.calledWith(200)).to.be.true;
    });

    it('Se não passado nenhum nome deve retornar status 400', async () => {
      sinon.stub(productServices, 'update').resolves({ code: 400, message: '"name" is required' });
      const req = { body: {}, params: { id: 5 } };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      await productControllers.update(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    })

    it('Se passado nome menor que 5 caracteres deve retornar status 422', async () => {
      sinon.stub(productServices, 'update').resolves({ code: 422, message: '"name" length must be at least 5 characters long' });
      const req = { body: { name: 'Baby' }, params: { id: 5 } };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      await productControllers.update(req, res);

      expect(res.status.calledWith(422)).to.be.true;
    });
  });
});