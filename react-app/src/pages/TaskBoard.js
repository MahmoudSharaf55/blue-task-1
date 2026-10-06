import { useTaskContext } from '../context/TaskContext';
import TaskColumn from '../components/TaskColumn';
import TaskModal from '../components/TaskModal';
import '../App.css';

const COLUMNS = [
  { id: 1, title: 'To Do', status: 'To Do' },
  { id: 2, title: 'In Progress', status: 'In Progress' },
  { id: 3, title: 'Done', status: 'Done' },
];

export default function TaskBoard() {
  const { loading, error, clearError, openCreateModal } = useTaskContext();

  return (
    <div className="board-container">
      <header className="board-header">
        <h1 className="board-title">Task Management Board</h1>
        <button
          type="button"
          className="btn-primary"
          onClick={openCreateModal}
        >
          + Add Task
        </button>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="alert-error">
          <span>{error}</span>
          <button type="button" className="btn-secondary" onClick={clearError}>
            Dismiss
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && <p style={{ color: '#64748b' }}>Loading tasks...</p>}

      {/* Columns Grid */}
      <div className="columns-grid">
        {COLUMNS.map((col) => (
          <TaskColumn
            key={col.id}
            title={col.title}
            status={col.status}
          />
        ))}
      </div>

      {/* Create / Edit Modal */}
      <TaskModal />
    </div>
  );
}
