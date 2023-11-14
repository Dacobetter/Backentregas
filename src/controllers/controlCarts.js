const cartDao = require('../dao/cartsDao');

const getAllCarts = async (req, res) => {
  try {
    const cartsData = await cartDao.getAllCarts();
    res.json(cartsData);
  } catch (error) {
    console.error('Error loading carts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getCartById = async (req, res) => {
  const cid = req.params.cid;
  try {
    const productosUsuario = await cartDao.getCartById(cid);
    if (productosUsuario === null) {
      return res.status(404).json({ status: 'error', error: `Usuario con id =${cid} no existe` });
    }
    return res.status(200).json({ status: 'success', data: productosUsuario });
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};

const postCart = async (req, res) => {
  try {
    const { items } = req.body; 
    const newCart = await cartDao.createCart(items);
    res.status(201).json(newCart);
  } catch (error) {
    console.error('Error creating cart:', error);
    res.status(500).json({ error: 'Internal Server Error' }); 
  }
};

const postCartById = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    await cartDao.addProductToCart(cid, pid);
    res.status(200).json({ status: 'success', message: 'Producto agregado al carrito' });
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};

const deleteCartsById = async(req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    await cartDao.deleteProductFromCart(cid, pid);
    res.status(200).json({ status: 'success', message: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};

const putCardById = async (req, res) => {
  try {
    const cid = req.params.cid;
    const products = req.body.products;
    const result = await cartDao.updateCart(cid, products);
    res.status(200).json({ status: 'success', payload: result });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
};

const putCardByIdProduct = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    const result = await cartDao.updateProductInCart(cid, pid, quantity);
    res.status(200).json({ status: 'success', payload: result });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllCarts,
  getCartById,
  postCart,
  postCartById,
  deleteCartsById,
  putCardById,
  putCardByIdProduct
};