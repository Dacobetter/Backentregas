const  {Router}  = require('express')
const cartModel = require("../models/cartModel")
const producto = require("../models/products");
const productModel = require('../models/products');


let products = [];

const router = Router()



router.get("/", async (req, res) => {
    try {
      const cartsData = await cartModel.find().lean().exec();
      res.json(cartsData); 
    } catch (error) {
      console.error('Error loading carts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.get("/:cid", async (req, res) => {
    const cid = req.params.cid
    try{
    const productosUsuario = await cartModel.findById(cid)
    if (productosUsuario === null){
        return res.status(404).json({ status: "error", error: `Usuario con id =${cid} no existe`})
    }
    return res.status(200).json({status: "success", data: productosUsuario})
 
} catch(error){
    return res.status(500).json({ status: "error", error: "Error interno del servidor" });
}}
)
 router.post("/", async (req, res) => {
    try {
      const { items } = req.body; 
      const newCart = new cartModel({
        items: items
      });
      const savedCart = await newCart.save();
      res.status(201).json(savedCart);
    } catch (error) {
      console.error('Error creating cart:', error);
      res.status(500).json({ error: 'Internal Server Error' }); 
    }
  });
  router.post("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
  
    try {
      const cart = await cartModel.findById(cid);
  
      if (!cart) {
        return res.status(404).json({ status: "error", error: `Usuario con id=${cid} no existe` });
      }
      const productToAdd = await producto.findById(pid);
  
      if (!productToAdd) {
        return res.status(404).json({ status: "error", error: `Producto con id=${pid} no existe` });
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
  
      res.status(200).json({ status: "success", message: "Producto agregado al carrito" });
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      res.status(500).json({ status: "error", error: "Error interno del servidor" });
    }
  });

  router.delete("/:cid/products/:pid", async(req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
  
    try {
      const cart = await cartModel.findById(cid);
  
      if (!cart) {
        return res.status(404).json({ status: "error", error: `Usuario con id=${cid} no existe` });
      }
      const productToEliminar = cart.products.findIndex((product) => product.productId.toString() === pid);
      if (productToEliminar !== -1) {
        const removedProduct = cart.products.splice(productToEliminar, 1)[0];
        const productToUpdate = await producto.findById(removedProduct.productId);
        if(productToUpdate){
            productToUpdate.stock += 1
            await productToUpdate.save()
        }
        await cart.save();

      res.status(200).json({ status: "success", message: "Producto eliminado del carrito" });
    } else {
      res.status(400).json({ status: "error", error: "El producto no existe en el carrito" });
    }
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ status: "error", error: "Error interno del servidor" });
  }
});
router.put("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const carrito = await cartModel.findById(cid);

    if (!carrito) {
      return res.status(404).json({ status: "error", error: `Carrito con id=${cid} no existe` });
    }

    const products = req.body.products;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ status: "error", error: "El campo 'products' es obligatorio y debe ser un arreglo" });
    }
    carrito.products = [];

    for (let index = 0; index < products.length; index++) {
      const productInfo = products[index];
      
      if (!productInfo || !productInfo.product || !productInfo.quantity) {
        return res.status(400).json({ status: "error", error: "Cada producto debe tener 'product' (ID de producto) y 'quantity' (cantidad)" });
      }

      if (typeof productInfo.quantity !== "number" || productInfo.quantity <= 0) {
        return res.status(400).json({ status: "error", error: "La cantidad debe ser un número válido mayor que cero" });
      }

      const addProduct = await producto.findById(productInfo.product);

      if (!addProduct) {
        return res.status(400).json({ status: "error", error: `Producto con id ${productInfo.product} no existe` });
      }
      carrito.products.push({
        product: addProduct._id,
        quantity: productInfo.quantity,
      });
    }

    const resultado = await carrito.save();
    resultado.products = resultado.products.map((product) => {
      return {
        product: product.product,
        quantity: product.quantity,
      };
    });
    res.status(200).json({ status: "success", payload: resultado });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const carrito = await cartModel.findById(cid);

    if (!carrito) {
      return res.status(404).json({ status: "error", error: `Carrito con id=${cid} no existe` });
    }

    const producto = await productModel.findById(pid);

    if (!producto) {
      return res.status(404).json({ status: "error", error: `Producto con id=${pid} no existe` });
    }
    const quantity = req.body.quantity;

    if (typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({ status: "error", error: "La cantidad debe ser un número válido y mayor que 0" });
    }

    const productIndex = carrito.products.findIndex((productItem) => productItem.product.equals(pid));

    if (productIndex !== -1) {
      carrito.products[productIndex].quantity = quantity;
    } else {
      return res.status(404).json({ status: "error", error: `Producto con id=${pid} no está en el carrito` });
    }

    const resultado = await carrito.save();
    res.status(200).json({ status: "success", payload: resultado });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});
module.exports = router; 