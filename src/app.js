const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();

const productManager = new ProductManager('../src/productos.json');

app.get('/products', async (req, res) => {
  try {
    const products = await productManager.getProductos();
    const limit = req.query.limit;
    
    if (typeof products === 'string') {
      const error = products.split(' ');
      return res.status(parseInt(error[0].slice(1, 4))).json({ error: error.slice(1).join(' ') });
    }
    
    res.status(200).json({ playload: products.slice(0, limit) });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await productManager.getProductoById(productId);

    if (typeof product === 'string') {
      const error = product.split(' ');
      return res.status(parseInt(error[0].slice(1, 4))).json({ error: error.slice(1).join(' ') });
    } else {
      res.status(200).json({ playload: product });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(8080, () => console.log('Servidor activo en el puerto 8080'));