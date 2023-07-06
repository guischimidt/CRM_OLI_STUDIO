const router = require('express').Router();

const CustomerController = require('../controllers/CustomerController.js');

//middlewares

router.post('/create', CustomerController.create);
router.patch('/edit/:id', CustomerController.update);
router.get('/name/:name', CustomerController.getByName);
router.get('/:id', CustomerController.getById);
router.delete('/:id', CustomerController.remove);
router.get('/', CustomerController.getAll);

module.exports = router;