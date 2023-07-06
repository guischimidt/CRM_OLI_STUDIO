const router = require('express').Router();

const ScheduleController = require('../controllers/ScheduleController.js');

//middlewares

router.post('/create', ScheduleController.create);
router.patch('/:id', ScheduleController.update);
router.get('/:name', ScheduleController.getByName);
router.get('/status/:status', ScheduleController.getByStatus);
router.post('/sendMessage', ScheduleController.verifyMessages);
router.get('/', ScheduleController.getAll);

module.exports = router;