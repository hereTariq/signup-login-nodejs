const router = require('express').Router();
const userController = require('../controllers/user');
const {
    signupValidation,
    loginValidation,
} = require('../middlewares/validaiton');
const verify = require('../middlewares/auth');

router.post('/signup', signupValidation, userController.signup);
router.post('/login', loginValidation, userController.login);
router.get('/users/:userId', userController.getUserById);
router.get('/users', userController.getUsers);
module.exports = router;
