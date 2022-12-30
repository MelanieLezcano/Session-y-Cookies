
const express = require('express');
const {register, processRegister, login, processLogin, logout, perfil} = require('../controllers/userController');
const router = express.Router();

const registerValidator = require('../middlewares/validaciones')
const loginValidator = require('../middlewares/loginvalidator')

/* GET users listing. */
router.get('/perfil', perfil)

router.get('/register', register);
router.post('/register', registerValidator, processRegister);

router.get('/login', login)
router.post('/login', loginValidator, processLogin)
router.delete('/logout', logout)

module.exports = router;