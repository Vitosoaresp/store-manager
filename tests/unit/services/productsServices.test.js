const { expect } = require('chai');
const sinon = require('sinon');
const productModels = require('../../../models/productModels');
const productServices = require('../../../services/productServices');

describe('Test Services products', () => {
  beforeEach(sinon.restore);
  const FAKE_PRODUCT = { id: 1, name: 'Baby yoda' };

  describe('Ao buscar pelos produtos', () => {
    const FAKE_PRODUCTS = [
      { id: 1, name: 'Baby yoda' }, { id: 2, name: 'Darth vader' }, { id: 3, name: 'Luke skywalker' },
    ];
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
  }),
    describe('Ao buscar por um produto', () => {
      it('Deve retornar o produto especifico', async () => {
        sinon.stub(productModels, 'getById').resolves([FAKE_PRODUCT]);
        const { data, message } = await productServices.getById(1);
        expect(message).to.be.undefined;
        expect(data).to.be.all.keys('id', 'name');
        expect(data.id).to.be.equal(1);
        expect(data.name).to.be.equal('Baby yoda');
      })
      it('Caso o produto não exista deve retornar a mensagem "Product not found"', async () => {
        sinon.stub(productModels, 'getById').resolves([null]);
        const { data, message } = await productServices.getById(999);
        expect(data).to.be.undefined;
        expect(message).to.be.equal('Product not found');
      });
    });

  describe('Ao cadastrar um produto', () => {
    const FAKE_PRODUCT = { id: 5, name: 'Baby yoda 2.0' };
    it('Deve retornar o produto cadastrado', async () => {
      sinon.stub(productModels, 'create').resolves(FAKE_PRODUCT);
      const { data, message } = await productServices.create({ name: 'Baby yoda 2.0' });
      expect(message).to.be.undefined;
      expect(data).to.be.all.keys('id', 'name');
      expect(data.id).to.be.equal(5);
      expect(data.name).to.be.equal('Baby yoda 2.0');
    })
    it('Caso não seja passado o nome do produto, deve retornar a mensagem "name is required"', async () => {
      sinon.stub(productModels, 'create').resolves(FAKE_PRODUCT);
      const { data, message } = await productServices.create({});
      expect(data).to.be.undefined;
      expect(message).to.be.equal('"name" is required');
    });
    it('Caso o nome seja menor que 5 caracteress, deve retornar a mensagem ""name" length must be at least 5 characters long"', async () => {
      sinon.stub(productModels, 'create').resolves(FAKE_PRODUCT);
      const { data, message } = await productServices.create({ name: 'Baby' });
      expect(data).to.be.undefined;
      expect(message).to.be.equal('"name" length must be at least 5 characters long');
    });
  });

  describe('Ao atualizar um produto', () => {
    it('Deve retornar o produto atualizado', async () => {
      sinon.stub(productModels, 'update').resolves(FAKE_PRODUCT);
      sinon.stub(productModels, 'getById').resolves([FAKE_PRODUCT]);
      const result = await productServices.update({ id: 1, name: 'Baby yoda 2.0' });
      expect(result.message).to.be.undefined;
      expect(result.data).to.be.all.keys('id', 'name');
    });

    it('Caso não seja passado o nome do produto, deve retornar a mensagem "name is required"', async () => {
      sinon.stub(productModels, 'update').resolves(FAKE_PRODUCT);
      sinon.stub(productModels, 'getById').resolves([FAKE_PRODUCT]);
      const result = await productServices.update({ id: 1, name: '' });
      expect(result.message).to.be.equal('"name" is required');
      expect(result.data).to.be.undefined;
    });

    it('Caso o nome seja menor que 5 caracteres, deve retornar a mensagem "name length must be at least 5 characters long"', async () => {
      sinon.stub(productModels, 'update').resolves(FAKE_PRODUCT);
      sinon.stub(productModels, 'getById').resolves([FAKE_PRODUCT]);
      const result = await productServices.update({ id: 1, name: 'Baby' });
      expect(result.message).to.be.equal('"name" length must be at least 5 characters long');
      expect(result.data).to.be.undefined;
    });

    it('Caso o produto não exista, deve retornar a mensagem "Product not found"', async () => {
      sinon.stub(productModels, 'update').resolves(FAKE_PRODUCT);
      sinon.stub(productModels, 'getById').resolves([null]);
      const result = await productServices.update({ id: 1, name: 'Baby yoda 2.0' });
      expect(result.message).to.be.equal('Product not found');
      expect(result.data).to.be.undefined;
    });
  });

  describe('Ao deletar um produto', () => {
    it('Se o produto existir, não deve retornar nenhuma mensagem', async () => {
      sinon.stub(productModels, 'deleteProduct').resolves(true);
      sinon.stub(productModels, 'getById').resolves([FAKE_PRODUCT]);
      const result = await productServices.deleteProduct({ id: 1 });
      expect(result.message).to.be.undefined;
    });

    it('Caso o produto não exista,deve retornar uma mensagem', async () => {
      sinon.stub(productModels, 'deleteProduct').resolves();
      sinon.stub(productModels, 'getById').resolves([null]);
      const result = await productServices.deleteProduct({ id: 1 });
      expect(result.message).to.be.equal('Product not found');
    });
  });
});