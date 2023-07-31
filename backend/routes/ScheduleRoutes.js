const router = require('express').Router();
const ScheduleController = require('../controllers/ScheduleController.js');

//middlewares
const verifyToken = require('../helpers/verify-token');

router.get('/sendMessage', ScheduleController.verifyMessages);

router.post('/create', verifyToken, ScheduleController.create);
router.patch('/:id', verifyToken, ScheduleController.update);
router.get('/:name', verifyToken, ScheduleController.getByName);
router.get('/status/:status', verifyToken, ScheduleController.getByStatus);
router.get('/', verifyToken, ScheduleController.getAll);

module.exports = router;