const  {Router}  = require('express')
const constroladorProduct = require('../controllers/constroladorProduct')


const router = Router()



router.get('/', constroladorProduct.getProducts)

router.get("/:pid", constroladorProduct.getProductsById)

router.post("/", constroladorProduct.postProducts);

router.delete("/:pid",constroladorProduct.deleteProductById);

module.exports = router; 