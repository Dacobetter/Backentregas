const privateRoutes = (req, res, next) =>{
    if(!req.session.user) return res.redirect('/')
    next()
}
// const publicRoutes = (req, res, next) =>{
    
// }
module.exports = { privateRoutes};