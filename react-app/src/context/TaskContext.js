import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';

const TaskContext = createContext(null);

const PRIORITY_ORDER = {
  High: 1,
  Medium: 2,
  Low: 3,
};

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const addTask = async (taskData) => {
    setError(null);
    try {
      const newTask = await taskService.create(taskData);
      setTasks((prev) => [newTask, ...prev]);
      closeModal();
      return newTask;
    } catch (err) {
      setError(err.message || 'Failed to create task');
      throw err;
    }
  };

  const editTask = async (id, updatedFields) => {
    setError(null);
    try {
      const updated = await taskService.update(id, updatedFields);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      closeModal();
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to update task');
      throw err;
    }
  };

  const removeTask = async (id) => {
    setError(null);
    try {
      await taskService.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (editingTask && editingTask.id === id) {
        closeModal();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete task');
      throw err;
    }
  };

  const moveTask = async (id, newStatus) => {
    const currentTask = tasks.find((t) => t.id === id);
    if (!currentTask || currentTask.status === newStatus) return;

    // Optimistic UI update
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
          : t
      )
    );

    try {
      const updated = await taskService.update(id, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      // Rollback on failure
      setTasks(previousTasks);
      setError(err.message || 'Failed to persist task status change');
    }
  };

  const getTasksByStatus = (status) => {
    return tasks
      .filter((task) => task.status === status)
      .sort((a, b) => {
        const priorityDiff =
          (PRIORITY_ORDER[a.priority] ?? 4) - (PRIORITY_ORDER[b.priority] ?? 4);
        if (priorityDiff !== 0) return priorityDiff;

        // Secondary sort: newest updated/created first
        const dateA = new Date(a.updatedAt || a.createdAt || 0);
        const dateB = new Date(b.updatedAt || b.createdAt || 0);
        return dateB - dateA;
      });
  };

  const clearError = () => setError(null);

  const value = {
    tasks,
    loading,
    error,
    isModalOpen,
    editingTask,
    openCreateModal,
    openEditModal,
    closeModal,
    addTask,
    editTask,
    removeTask,
    moveTask,
    getTasksByStatus,
    clearError,
    refreshTasks: fetchTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
