const taskRepository = require('../repositories/task.repository');

class TaskService {
  async getAllTasks() {
    return taskRepository.findAll();
  }

  async getTaskById(id) {
    const task = await taskRepository.findById(id);
    if (!task) {
      const error = new Error(`Task with id '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }
    return task;
  }

  async createTask(taskData) {
    return taskRepository.create(taskData);
  }

  async updateTask(id, updateData) {
    // Check existence first or update directly
    const updated = await taskRepository.updateById(id, updateData);

    if (!updated) {
      const error = new Error(`Task with id '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return updated;
  }

  async deleteTask(id) {
    const deleted = await taskRepository.deleteById(id);
    if (!deleted) {
      const error = new Error(`Task with id '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }
    return deleted;
  }
}

module.exports = new TaskService();
