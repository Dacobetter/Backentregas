const  {Router}  = require('express')
const product = require("../models/products")
const cartModel = require("../models/cartModel")
const {getProducts} = require('../controllers/controladorProduct')

const router = Router()




router.get('/', async (req, res) => {
    const result = await getProducts(req, res)
    res.status(result.statusCode).json(result.response)
})
router.get("/:pid", async (req, res) => {
    const pid = req.params.pid
    try{
        const producto = await product.findById(pid)
        if(producto === null){
            return res.status(404).json({ status: "error", error: `Producti con id =${pid} no existe`})
        }return res.status(200).json({status: "success", data: producto})
 
    } catch(error){
        return res.status(500).json({ status: "error", error: "Error interno del servidor" });       
    }
})
router.post("/", async (req, res) => {
    try {
        const { title, description, price, code, stock, category  } = req.body;
        const nuevoProducto = new product({
            title: title,
        description: description,
        price: price,
        code:code ,
        stock:stock,
        category: category,
        });
        await nuevoProducto.save();
        res.status(201).json({ message: "Producto creado exitosamente", producto: nuevoProducto });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el producto" });
    }
});
router.delete("/:pid", async (req, res) => {
    const pid = req.params.pid;
    try {
        const productoBorrar = await product.findById(pid);
        if (productoBorrar === null) {
            return res.status(404).json({ status: "error", error: `Producto con id = ${pid} no existe` });
        } else {
            await product.deleteMany({_id: pid}); 
            res.status(204).json(); 
        }
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ status: "error", error: "Error interno del servidor" });
    }
});

module.exports = router; 