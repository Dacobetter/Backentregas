const  {Router}  = require('express')
const baseModel = require("../models/products")
const cartModel = require('../models/cartModel')
const router = Router()
const {getProducts} = require('../controllers/controladorProduct')
const{ privateRoutes} = require("../middleware/auth.middleware")
const passport = require('passport')





router.get('/', privateRoutes,  async (req, res) => {
    try {
    const carro = new cartModel({ products: []})
    const saveCart = await carro.save()
    const cart = saveCart._id
    const result = await getProducts(req, res)
    if (result.statusCode === 200) {
        const totalPages = []
        let link
        for (let index = 1; index <= result.response.totalPages; index++) {
            if (!req.query.page) {
                link = `http://${req.hostname}:${8080}${req.originalUrl}?page=${index}`
            } else {
                const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${index}`)
                link = `http://${req.hostname}:${8080}${modifiedUrl}`
            }
            totalPages.push({ page: index, link })
        }
        const user = req.session.user
        res.render('home', {
            user,
            cart,
            products: result.response.payload, paginateInfo: {
                hasPrevPage: result.response.hasPrevPage,
                hasNextPage: result.response.hasNextPage,
                prevLink: result.response.prevLink,
                nextLink: result.response.nextLink,
                totalPages
            }
        })
    } else {
        res.status(result.statusCode).json({ status: 'error', error: result.response.error })
    }
}catch(err){
    console.error("Error al crear el carrito:",);
    res.status(500).json({ status: "error", error: "Error interno del servidor" });
}
})

router.get('/realtimeProducts',privateRoutes, async (req, res) => {try {const products = await baseModel.find().lean().exec()
    const carro = new cartModel({ products: []})
    const saveCart = await carro.save()
    const cart = saveCart._id
    res.render('realTimeProducts' , {products, cart})
}catch(err){
    console.error("Error al crear el carrito:",);
    res.status(500).json({ status: "error", error: "Error interno del servidor" });
}
}) 

module.exports = router; 