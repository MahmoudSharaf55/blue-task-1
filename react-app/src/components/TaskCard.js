import { useTaskContext } from '../context/TaskContext';

export default function TaskCard({ task }) {
  const { openEditModal, removeTask } = useTaskContext();

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      removeTask(task.id);
    }
  };

  const priorityClass = `badge-priority priority-${task.priority.toLowerCase()}`;

  return (
    <div
      className="task-card"
      draggable
      onDragStart={handleDragStart}
    >
      <h4 className="task-card-title">{task.title}</h4>
      {task.description && (
        <p className="task-card-desc">{task.description}</p>
      )}

      <div className="task-card-meta">
        <span className={priorityClass}>{task.priority}</span>
        <div>
          <button
            type="button"
            className="btn-edit"
            onClick={() => openEditModal(task)}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
