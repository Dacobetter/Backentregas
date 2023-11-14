const  {Router}  = require('express')
const{ privateRoutes} = require("../middleware/auth.middleware")
const {getView, getRealtimeProducts} = require("../controllers/controladorView")




const router = Router()

router.get('/', privateRoutes ,getView)

router.get('/realtimeProducts', privateRoutes, getRealtimeProducts );

module.exports = router; 