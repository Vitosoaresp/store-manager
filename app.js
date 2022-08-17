const express = require('express');
const rescue = require('express-rescue');
const productController = require('./controllers/productController');
const salesProductsController = require('./controllers/salesProductsController');

const app = express();
app.use(express.json());

app.get('/', (_request, response) => {
  response.send();
});

app.get('/products/search', rescue(productController.getByQuery));
app.get('/products/:id', rescue(productController.getById));
app.get('/products', rescue(productController.getAll));
app.post('/products', rescue(productController.create));
app.put('/products/:id', rescue(productController.update));
app.delete('/products/:id', rescue(productController.deleteProduct));

app.get('/sales/:id', rescue(salesProductsController.getById));
app.get('/sales', rescue(salesProductsController.getAll));
app.post('/sales', rescue(salesProductsController.create));
app.put('/sales/:id', rescue(salesProductsController.update));
app.delete('/sales/:id', rescue(salesProductsController.deleteSale));

app.use((err, _req, res, _next) => {
  console.log(err);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;