const express = require('express');
const taskController = require('../controllers/task.controller');
const {
  validateTaskId,
  validateCreateTask,
  validateUpdateTask,
} = require('../middlewares/validate.middleware');

const router = express.Router();

router.get('/', (req, res, next) => taskController.getAllTasks(req, res, next));
router.post('/', validateCreateTask, (req, res, next) => taskController.createTask(req, res, next));
router.get('/:id', validateTaskId, (req, res, next) => taskController.getTaskById(req, res, next));
router.put('/:id', validateTaskId, validateUpdateTask, (req, res, next) => taskController.updateTask(req, res, next));
router.delete('/:id', validateTaskId, (req, res, next) => taskController.deleteTask(req, res, next));

module.exports = router;
