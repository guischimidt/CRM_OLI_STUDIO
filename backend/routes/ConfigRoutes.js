const router = require('express').Router();

const ConfigController = require('../controllers/ConfigController.js');

//middlewares
const verifyToken = require('../helpers/verify-token');

router.post('/procedures/create', verifyToken, ConfigController.createProcedure);
router.patch('/procedures/:id', verifyToken, ConfigController.updateProcedure);
router.delete('/procedures/:id', verifyToken, ConfigController.removeProcedure);
router.get('/procedures/:id', verifyToken, ConfigController.getByIdProcedures);
router.get('/procedures/', verifyToken, ConfigController.getAllProcedures);

router.post('/payments/create', verifyToken, ConfigController.createPayment);
router.patch('/payments/:id', verifyToken, ConfigController.updatePayment);
router.delete('/payments/:id', verifyToken, ConfigController.removePayment);
router.get('/payments/:id', verifyToken, ConfigController.getByIdPayments);
router.get('/payments/', verifyToken, ConfigController.getAllPayments);
//router.get('/', CustomerController.getAll);

module.exports = router;