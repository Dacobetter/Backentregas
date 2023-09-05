
const fs = require('fs').promises;
const path = require('path');

const cartsFilePath = path.join(__dirname,'..',  '..', 'src', 'json', 'carts.json');
const productsFilePath = path.join(__dirname,'..',  '..', 'src', 'json', 'productos.json');

let carts = [];
let products = [];

async function loadCartsFromFile() {
  try {
    const cartsData = await fs.readFile(cartsFilePath, 'utf-8');
    carts = JSON.parse(cartsData);
    console.log(carts)
  } catch (error) {
    carts = [];
    console.error('Error loading carts:', error); 
  }
}

async function loadProductsFromFile() {
  try {
    const productsData = await fs.readFile(productsFilePath, 'utf-8');
    products = JSON.parse(productsData);
    console.log(products)
  } catch (error) {
    products = [];
  }
}

async function saveCartsToFile() {
  const cartsData = JSON.stringify(carts, null, 2);
  await fs.writeFile(cartsFilePath, cartsData, 'utf-8');
}

function findCartById(cartId) {
  return carts.find(cart => cart.id === cartId);
}

 function findProductById(productId) {
    const productIdNumber = Number(productId);
  return products.find(product => product.id === productIdNumber);
}

function generateUniqueID() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

async function postCart(req, res) {
  const newCart = {
    id: generateUniqueID(),
    products: [],
  };
  carts.push(newCart);
  try {
    await saveCartsToFile();
    res.json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el carrito en el archivo' });
  }
}

async function getCart(req, res) {
  const cartId = req.params.cid;
  const cart = findCartById(cartId);

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  res.json(cart.products);
}

async function addProductToCart(req, res) {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const cart = findCartById(cartId);

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const product = findProductById(productId);

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const existingProduct = cart.products.find(p => p.product === productId);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.products.push({ product: productId, quantity: 1 });
  }

  try {
    await saveCartsToFile();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el carrito en el archivo' });
  }
}

loadCartsFromFile();
loadProductsFromFile();

module.exports = {
  postCart,
  getCart,
  addProductToCart,
};