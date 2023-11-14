const  {Router}  = require('express')
const baseModel = require("../dao/models/products")
const cartModel = require('../dao/models/cartModel')
const router = Router()


router.get('/:cid', async (req, res) => {
    try {
      const cid = req.params.cid;
      const cart = await cartModel.findById(cid);
  
      if (!cart) {
        return res.status(404).json({ status: "error", error: `Carrito con ID=${cid} no encontrado` });
      }
      res.render('carrito', { cart });
    } catch (err) {
      console.error("Error al cargar el carrito:", err);
      res.status(500).json({ status: "error", error: "Error interno del servidor" });
    }
  });
  module.exports = router;