const { Router } = require('express');


const router = Router();


router.get('/register',  async (req, res) => {
  res.render('sessions/register');
});

router.get('/',  async (req, res) => {
  res.render('sessions/login');
});

module.exports = router;

