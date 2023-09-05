const  {Router}  = require('express')
const ProductManger = require('../js/ProductManager')

const router = Router()
const productManager = new ProductManger('./src/json/productos.json')


router.get('/', async (req, res) => {
    const products = await productManager.getProductos()
    res.render('home' , {products})
})

router.get('/realtimeProducts', async (req, res) => {
    const products = await productManager.getProductos()
    res.render('realtimeProducts', {products})
})

module.exports = router; 