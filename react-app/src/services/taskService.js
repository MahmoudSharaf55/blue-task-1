const API_URL = 'http://localhost:5000/tasks';

export const taskService = {
  async getAll() {
    const res = await fetch(API_URL);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch tasks');
    }
    return data.data;
  },

  async getById(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch task');
    }
    return data.data;
  },

  async create(taskData) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to create task');
    }
    return data.data;
  },

  async update(id, taskData) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update task');
    }
    return data.data;
  },

  async delete(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete task');
    }
    return true;
  },
};
