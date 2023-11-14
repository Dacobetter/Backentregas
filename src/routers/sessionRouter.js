const {Router} = require("express")
const passport = require("passport")
const controladorSession = require("../controllers/controladorSession")
const router = Router()

router.get('/register', controladorSession.getRegister )

router.post('/register', passport.authenticate('register', {failureRedirect: '/sessions/failRegister'}), controladorSession.postRegister)

router.get('login',controladorSession.getLogin )

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/failLogin' }), controladorSession.postLogin);

router.get('/failLogin', (req, res) => res.send({ error: "Passport Login Failed"}))

router.get('/logout', controladorSession.getLogout)

router.get('/current', controladorSession.getCurrent)

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), (req, res) => {    
});
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), controladorSession.getGitHubCallback)

module.exports = router;