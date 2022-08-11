const express = require('express');
const rescue = require('express-rescue');
const productController = require('./controllers/productController');

const app = express();

// não remova esse endpoint, é para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.get('/products', rescue(productController.getAll));
app.get('/products/:id', rescue(productController.getById));

app.use((err, _req, res, _next) => {
  console.log(err);
  res.status(500).json({ message: 'Internal server error' });
});
// não remova essa exportação, é para o avaliador funcionar
// você pode registrar suas rotas normalmente, como o exemplo acima
// você deve usar o arquivo index.js para executar sua aplicação 
module.exports = app;