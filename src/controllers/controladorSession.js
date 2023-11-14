const config = require('../config/config');
const userDao = require('../dao/sessionDao');

const getRegister = async (req, res) => {
  res.redirect('sessions/register');
};

const postRegister = async (req, res) => {
  res.redirect('/');
};

const getLogin = (req, res) => {
  res.render('sessions/login');
};

const postLogin = async (req, res) => {
  try {
    const user = await userDao.getUserByEmail(req.user.email);

    if (!user) {
      res.status(400).send({ status: 'error', error: 'Credenciales Inválidas' });
      return;
    }

    req.session.user = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      cart: user.cart,
      role: user.role,
    };

    if (
      user.email === config.admin.adminEmail &&
      user.password === config.admin.adminPass
    ) {
      req.session.user = {
        first_name: 'Administrador',
        email: config.admin.adminEmail,
        role: 'admin',
      };
    }

    res.redirect('/products');
  } catch (err) {
    console.error('Error en la autenticación:', err);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};

const getLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render('errors/base', { error: err });
    } else res.redirect('/');
  });
};

const getCurrent = async (req, res) => {
  req.session.user = req.user;
  res.redirect('/current');
};

const getGitHubCallback = async (req, res) => {
  try {
    console.log('Usuario autenticado con GitHub:', req.user);
    req.session.user = req.user;
    console.log('Sesión actualizada:', req.session.user);
    console.log('Redireccionando a /products');
    res.redirect('/products');
  } catch (error) {
    console.error('Error en la redirección después de GitHub callback:', error);
    res.status(500).send('Internal Server Error');
  }
};


module.exports = {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout,
  getCurrent,
  getGitHubCallback,
};