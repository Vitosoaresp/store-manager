const { expect } = require('chai');
const sinon = require('sinon');
const productModels = require('../../../models/productModels');
const connection = require('../../../models/connection');

describe('Test Model products', () => {
  beforeEach(sinon.restore);
  const FAKE_PRODUCT = { id: 1, name: 'Baby yoda' };

  describe('Testa ao Listar todos os produtos', () => {
    const FAKE_PRODUCTS = [
      { id: 1, name: 'Baby yoda' }, { id: 2, name: 'Darth vader' }, { id: 3, name: 'Luke skywalker' },
    ];
    it('Deve retornar todos os produtos', async () => {
      sinon.stub(connection, 'execute').resolves([FAKE_PRODUCTS]);
      const getProducts = await productModels.getAll();
      expect(getProducts).to.be.eql(FAKE_PRODUCTS);
      getProducts.map((product) => expect(product).to.be.all.keys('id', 'name'));
    });
  })
  describe('Testa ao Listar um produto', () => {
    it('Deve retornar o produto especifico', async () => {
      sinon.stub(connection, 'execute').resolves([FAKE_PRODUCT]);
      const getProduct = await productModels.getById(1);
      expect(getProduct).to.be.all.keys('id', 'name');
      expect(getProduct.id).to.be.equal(1);
      expect(getProduct.name).to.be.equal('Baby yoda');
    });
  });

  describe('Testa ao criar um produto', () => {
    it('Deve retornar o produto criado', async () => {
      sinon.stub(connection, 'execute').resolves([{ insertId: 5 }]);
      const createProduct = await productModels.create({ name: 'Baby yoda 2.0' });
      expect(createProduct).to.be.all.keys('id', 'name');
      expect(createProduct.id).to.be.equal(5);
      expect(createProduct.name).to.be.equal('Baby yoda 2.0');
    })
  });

  describe('Testa ao atualizar um produto', () => {
    it('Deve retornar o produto atualizado', async () => {
      sinon.stub(connection, 'execute').resolves(FAKE_PRODUCT);
      const updateProduct = await productModels.update({ id: 1, name: 'Baby yoda' });
      expect(updateProduct).to.be.all.keys('id', 'name');
      expect(updateProduct.id).to.be.equal(FAKE_PRODUCT.id);
      expect(updateProduct.name).to.be.equal(FAKE_PRODUCT.name);
    });
  });

  describe('Testa ao deletar um produto', () => {
    it('Deve retornar o id', async () => {
      sinon.stub(connection, 'execute').resolves(FAKE_PRODUCT);
      const deleteProduct = await productModels.deleteProduct({ id: 1 });
      expect(deleteProduct).to.be.all.keys('id');
      expect(deleteProduct.id).to.be.equal(FAKE_PRODUCT.id);
    });
  });
});