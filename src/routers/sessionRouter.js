const {Router} = require("express")
const UserModel = require("../models/user.model")


const router = Router()


router.post('/register', async(req, res) => {
    const userToRegister = req.body
    const user = new UserModel(userToRegister)
    await user.save()
    res.redirect("/")
})

router.post('/login', async (req,res) =>{
    const {email, password} = req.body
    const user = await UserModel.findOne({email,password}).lean().exec()
    if(!user) {
        return res.redirect("/")
    }
    if(user.email === 'admin@admin.com' && user.password == 'admin'){
        user.role = 'admin'
    }else {
        user.role = 'user'
    }
    req.session.user = user
    res.redirect('/products')
})

router.get('/logout', (req,res) =>{
req.session.destroy(err =>{
    if(err){
      res.status(500).render('errors/base', {error:err})  
    }else res.redirect('/')
}
    )
})

module.exports = router;