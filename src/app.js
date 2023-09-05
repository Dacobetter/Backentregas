const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const products = require('./Js/products');
const carts = require('./Js/carts');
const handlebars = require("express-handlebars")
const viewsRouter = require('./routers/view.router')
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static('./src/public'));
app.engine('handlebars', handlebars.engine());
app.set('views', './src/views')
app.set('view engine', 'handlebars');


app.get('/', (req, res) => res.render('index'))
app.use('/products', viewsRouter);
app.get('/api/products', products.getAllProducts);
app.get('/api/products/:pid', products.getProductById);
app.post('/api/products', products.addProduct);
app.put('/api/products/:pid', products.updateProduct);
app.delete('/api/products/:pid', products.deleteProduct);


app.post('/api/carts', carts.postCart);
app.get('/api/carts/:cid', carts.getCart);
app.post('/api/carts/:cid/product/:pid', carts.addProductToCart);


const httpServer = http.createServer(app);
const io = socketIO(httpServer); 

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});
io.on("connection", socket => {
    socket.on("productList", data => {
            io.emit("updatedProducts", data);
        
    });
});



