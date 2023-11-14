const { Router } = require('express');


const router = Router();


router.get('/register',  async (req, res) => {
  res.render('sessions/register');
});

router.get('/',  async (req, res) => {
  res.render('sessions/login');
});

router.get('/current', async(req,res) =>{  
  const currentUser = req.session.user;
        res.render('sessions/current', { user: currentUser })
})

module.exports = router;