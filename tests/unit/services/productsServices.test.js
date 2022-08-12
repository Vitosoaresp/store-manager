const { expect } = require('chai');
const sinon = require('sinon');
const productModels = require('../../../models/productModels');
const productServices = require('../../../services/productServices');

describe('Test Services products', () => {
  beforeEach(sinon.restore);

  describe('Ao buscar pelos produtos', () => {
    const FAKE_PRODUCTS = [
      { id: 1, name: 'Baby yoda' }, { id: 2, name: 'Darth vader' }, { id: 3, name: 'Luke skywalker' },
    ];
    const FAKE_PRODUCT = { id: 1, name: 'Baby yoda' };
    it('Deve retornar todos os produtos', async () => {
      sinon.stub(productModels, 'getAll').resolves(FAKE_PRODUCTS);
      const { data } = await productServices.getAll();
      expect(data).to.be.eql(FAKE_PRODUCTS);
      data.map((product, i) => {
        expect(product).to.be.all.keys('id', 'name');
        expect(product.id).to.be.equal(FAKE_PRODUCTS[i].id);
        expect(product.name).to.be.equal(FAKE_PRODUCTS[i].name);
      });
    })
    it('Deve retornar o produto especifico', async () => {
      sinon.stub(productModels, 'getById').resolves([FAKE_PRODUCT]);
      const { data, message } = await productServices.getById(1);
      expect(message).to.be.undefined;
      expect(data).to.be.all.keys('id', 'name');
      expect(data.id).to.be.equal(1);
      expect(data.name).to.be.equal('Baby yoda');
    })
    it('Deve retornar um erro ao buscar um produto que não existe', async () => {
      sinon.stub(productModels, 'getById').resolves([null]);
      const { data, message } = await productServices.getById(999);
      expect(data).to.be.undefined;
      expect(message).to.be.equal('Product not found');
    });
  });
});