const router = require('express').Router();

const CustomerController = require('../controllers/CustomerController.js');

//middlewares
const verifyToken = require('../helpers/verify-token');

router.get('/count', CustomerController.getCount);

router.post('/create', verifyToken, CustomerController.create);
router.patch('/edit/:id', verifyToken, CustomerController.update);
router.get('/name/:name', verifyToken, CustomerController.getByName);
router.get('/:id', verifyToken, CustomerController.getById);
router.delete('/:id', verifyToken, CustomerController.remove);
router.get('/', verifyToken, CustomerController.getAll);

module.exports = router;