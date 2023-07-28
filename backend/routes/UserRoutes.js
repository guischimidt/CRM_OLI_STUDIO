const router = require('express').Router();

const UserController = require('../controllers/UserController.js');

//middlewares
const verifyToken = require('../helpers/verify-token');

router.post('/signup', verifyToken, UserController.sign_up);
router.post('/login', UserController.sign_in);


module.exports = router;