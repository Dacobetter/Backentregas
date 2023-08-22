const ProductManager = require('./ProductManager');


const productManager = new ProductManager('../src/Json/productos.json');

productManager.iniciar()
  .then(() => {
    console.log('Administrador de productos iniciado');
  })
  .catch(error => {
    console.error('Error al iniciar el administrador de productos:', error);
  });
async function getAllProducts(req, res) {
  const products = await productManager.getProductos();
  res.json(products);
}

async function getProductById(req, res) {
  const productId = parseInt(req.params.pid);
  const product = await productManager.getProductoById(productId);
  res.json(product);
}

async function addProduct(req, res) {
  const newProduct = req.body;
  const result = await productManager.addProducto(newProduct);
  res.json({ message: result });
}

async function updateProduct(req, res) {
  const productId = parseInt(req.params.pid);
  const updatedValues = req.body;
  const result = await productManager.updateProduct(productId, updatedValues);
  res.json({ message: result });
}

async function deleteProduct(req, res) {
  const productId = parseInt(req.params.pid);
  const result = await productManager.deleteProduct(productId);
  res.json({ message: result });
}

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};