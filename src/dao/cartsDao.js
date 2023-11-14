const cartModel = require('../dao/models/cartModel');
const productModel = require('../dao/models/products');

const getAllCarts = async () => {
  return await cartModel.find().lean().exec();
};

const getCartById = async (cid) => {
  return await cartModel.findById(cid);
};

const createCart = async (items) => {
  const newCart = new cartModel({ items });
  return await newCart.save();
};

const addProductToCart = async (cid, pid) => {
  const cart = await cartModel.findById(cid);

  if (!cart) {
    throw new Error(`Usuario con id=${cid} no existe`);
  }

  const productToAdd = await productModel.findById(pid);

  if (!productToAdd) {
    throw new Error(`Producto con id=${pid} no existe`);
  }

  const existingProductIndex = cart.products.findIndex((product) => product.product.toString() === pid);

  if (existingProductIndex !== -1) {
    cart.products[existingProductIndex].quantity += 1;
  } else {
    cart.products.push({
      product: pid,
      quantity: 1,
    });
  }
  productToAdd.stock -= 1;
  await productToAdd.save();
  await cart.save();
};

const deleteProductFromCart = async (cid, pid) => {
  const cart = await cartModel.findById(cid);

  if (!cart) {
    throw new Error(`Usuario con id=${cid} no existe`);
  }

  const productToEliminateIndex = cart.products.findIndex((product) => product.product.toString() === pid);

  if (productToEliminateIndex !== -1) {
    const removedProduct = cart.products.splice(productToEliminateIndex, 1)[0];
    const productToUpdate = await productModel.findById(removedProduct.product);

    if (productToUpdate) {
      productToUpdate.stock += removedProduct.quantity;
      await productToUpdate.save();
    }
    await cart.save();
  } else {
    throw new Error('El producto no existe en el carrito');
  }
};

const updateCart = async (cid, products) => {
  const cart = await cartModel.findById(cid);

  if (!cart) {
    throw new Error(`Carrito con id=${cid} no existe`);
  }

  cart.items = [];

  for (let index = 0; index < products.length; index++) {
    const productInfo = products[index];

    if (!productInfo || !productInfo.product || !productInfo.quantity) {
      throw new Error("Cada producto debe tener 'product' (ID de producto) y 'quantity' (cantidad)");
    }

    if (typeof productInfo.quantity !== 'number' || productInfo.quantity <= 0) {
      throw new Error('La cantidad debe ser un número válido mayor que cero');
    }

    const addProduct = await productModel.findById(productInfo.product);

    if (!addProduct) {
      throw new Error(`Producto con id ${productInfo.product} no existe`);
    }
    cart.items.push({
      product: addProduct._id,
      quantity: productInfo.quantity,
    });
  }

  return await cart.save();
};

const updateProductInCart = async (cid, pid, quantity) => {
  const cart = await cartModel.findById(cid);

  if (!cart) {
    throw new Error(`Carrito con id=${cid} no existe`);
  }

  const productIndex = cart.items.findIndex((productItem) => productItem.product.equals(pid));

  if (productIndex !== -1) {
    cart.items[productIndex].quantity = quantity;
  } else {
    throw new Error(`Producto con id=${pid} no está en el carrito`);
  }

  return await cart.save();
};

module.exports = {
  getAllCarts,
  getCartById,
  createCart,
  addProductToCart,
  deleteProductFromCart,
  updateCart,
  updateProductInCart,
};