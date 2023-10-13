const {Router} = require("express")
const UserModel = require("../models/user.model")
const { createHash, isValidPassword } = require("../controladores/utils")
const passport = require("passport")


const router = Router()

router.get('/register', async(req, res) => {
    res.redirect("sessions/register")
})
router.post('/register', passport.authenticate('register', {failureRedirect: '/sessions/failRegister'}), async (req, res) => {
    res.redirect("/")
})
router.get('login', (req,res) =>{
    res.render('sessions/login')
})
router.post('/login', passport.authenticate('login', {failureRedirect: '/sessions/failLogin'}), async (req, res) => {
   if (!req.user){
    return res.status(400).send({status: 'error', error: 'Credenciales Invalidas'})
   }
   req.session.user = {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age,
   }
    res.redirect('/products')
})
router.get('/failLogin', (req, res) => res.send({ error: "Passport Login Failed"}))

router.get('/logout', (req,res) =>{
req.session.destroy(err =>{
    if(err){
      res.status(500).render('errors/base', {error:err})  
    }else res.redirect('/')
}
    )
})

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), (req, res) => {
    
});
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async(req,res) =>{
    req.session.user = req.user
    res.redirect('/products')
   })

module.exports = router;