const express = require('express');
const rescue = require('express-rescue');
const productController = require('./controllers/productController');
const salesProductsController = require('./controllers/salesProductsController');

const app = express();
app.use(express.json());

// não remova esse endpoint, é para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.get('/products/:id', rescue(productController.getById));
app.get('/products', rescue(productController.getAll));
app.post('/products', rescue(productController.create));
app.put('/products/:id', rescue(productController.update));
app.delete('/products/:id', rescue(productController.deleteProduct));

app.get('/sales/:id', rescue(salesProductsController.getById));
app.get('/sales', rescue(salesProductsController.getAll));
app.post('/sales', rescue(salesProductsController.create));
app.delete('/sales/:id', rescue(salesProductsController.deleteSale));

app.use((err, _req, res, _next) => {
  console.log(err);
  res.status(500).json({ message: 'Internal server error' });
});
// não remova essa exportação, é para o avaliador funcionar
// você pode registrar suas rotas normalmente, como o exemplo acima
// você deve usar o arquivo index.js para executar sua aplicação 
module.exports = app;