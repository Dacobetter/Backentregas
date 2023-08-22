const express = require('express');
const products = require('./Js/products')
const carts = require('./Js/carts')
const app = express();

app.use(express.json());


app.get('/api/products', products.getAllProducts);
app.get('/api/products/:pid', products.getProductById);
app.post('/api/products', products.addProduct);
app.put('/api/products/:pid', products.updateProduct);
app.delete('/api/products/:pid', products.deleteProduct);

app.post('/api/carts', carts.postCart);
app.get('/api/carts/:cid', carts.getCart);
app.post('/api/carts/:cid/product/:pid', carts.addProductToCart);
app.listen(8080, () => console.log('Servidor activo en el puerto 8080'));