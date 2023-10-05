const { Router } = require('express');


const router = Router();


router.get('/register',  async (req, res) => {
  res.render('sessions/register');
});

router.get('/',  async (req, res) => {
  res.render('sessions/login');
});

// router.get('/profile', publicRoutes, async (req, res) => {
//   res.render('sessions/profile', req.session.user);
// });

module.exports = router;
