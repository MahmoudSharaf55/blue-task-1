import { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';

const INITIAL_STATE = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'To Do',
};

export default function TaskModal() {
  const {
    isModalOpen,
    editingTask,
    closeModal,
    addTask,
    editTask,
  } = useTaskContext();

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        priority: editingTask.priority || 'Medium',
        status: editingTask.status || 'To Do',
      });
    } else {
      setFormData(INITIAL_STATE);
    }
    setValidationError('');
  }, [editingTask, isModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal]);

  if (!isModalOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'title' && value.trim()) {
      setValidationError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setValidationError('Title is required');
      return;
    }

    try {
      if (editingTask) {
        await editTask(editingTask.id, formData);
      } else {
        await addTask(formData);
      }
    } catch {
      // Error is set in context
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={closeModal}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {validationError && (
          <div className="form-error">
            {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
