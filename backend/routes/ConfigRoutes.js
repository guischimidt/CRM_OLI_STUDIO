const router = require('express').Router();

const ConfigController = require('../controllers/ConfigController.js');

//middlewares

router.post('/procedures/create', ConfigController.createProcedure);
router.patch('/procedures/:id', ConfigController.updateProcedure);
router.delete('/procedures/:id', ConfigController.removeProcedure);
router.get('/procedures/:id', ConfigController.getByIdProcedures);
router.get('/procedures/', ConfigController.getAllProcedures);

router.post('/payments/create', ConfigController.createPayment);
router.patch('/payments/:id', ConfigController.updatePayment);
router.delete('/payments/:id', ConfigController.removePayment);
router.get('/payments/:id', ConfigController.getByIdPayments);
router.get('/payments/', ConfigController.getAllPayments);
//router.get('/', CustomerController.getAll);

module.exports = router;