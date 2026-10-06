const Task = require('../models/task.model');

class TaskRepository {
  async findAll() {
    return Task.find().sort({ createdAt: -1 });
  }

  async findById(id) {
    return Task.findById(id);
  }

  async create(taskData) {
    return Task.create(taskData);
  }

  async updateById(id, taskData) {
    return Task.findByIdAndUpdate(id, taskData, {
      returnDocument: 'after',
      runValidators: true,
    });
  }

  async deleteById(id) {
    return Task.findByIdAndDelete(id);
  }
}

module.exports = new TaskRepository();
