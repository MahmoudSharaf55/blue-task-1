const mongoose = require('mongoose');

const VALID_STATUSES = ['To Do', 'In Progress', 'Done'];
const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

const validateTaskId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: `Invalid task ID format: ${id}`,
    });
  }
  next();
};

const validateCreateTask = (req, res, next) => {
  const { title, status, priority } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Title is required and must be a non-empty string',
    });
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}`,
    });
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: `Invalid priority. Allowed values: ${VALID_PRIORITIES.join(', ')}`,
    });
  }

  next();
};

const validateUpdateTask = (req, res, next) => {
  const { title, status, priority } = req.body;

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({
      success: false,
      message: 'Title must be a non-empty string if provided',
    });
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}`,
    });
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: `Invalid priority. Allowed values: ${VALID_PRIORITIES.join(', ')}`,
    });
  }

  next();
};

module.exports = {
  validateTaskId,
  validateCreateTask,
  validateUpdateTask,
};
