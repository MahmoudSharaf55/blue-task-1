import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskCard from './TaskCard';

export default function TaskColumn({ title, status }) {
  const { getTasksByStatus, moveTask } = useTaskContext();
  const [isDragOver, setIsDragOver] = useState(false);

  const columnTasks = getTasksByStatus(status);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTask(taskId, status);
    }
  };

  return (
    <div
      className={`task-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <h3 className="column-title">{title}</h3>
        <span className="column-count">{columnTasks.length}</span>
      </div>

      {columnTasks.length === 0 ? (
        <div className="empty-state">No tasks here</div>
      ) : (
        columnTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))
      )}
    </div>
  );
}
