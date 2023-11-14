const  {Router}  = require('express')
const constrolCarts = require("../controllers/controlCarts")


const router = Router()



router.get("/", constrolCarts.getAllCarts);

router.get("/:cid", constrolCarts.getCartById);

router.post("/", constrolCarts.postCart )

router.post("/:cid/products/:pid", constrolCarts.postCartById);

router.delete("/:cid/products/:pid", constrolCarts.deleteCartsById);

router.put("/:cid", constrolCarts.putCardById );

router.put("/:cid/products/:pid", constrolCarts.putCardByIdProduct);


module.exports = router; 