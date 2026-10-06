import { TaskProvider } from './context/TaskContext';
import TaskBoard from './pages/TaskBoard';

function App() {
  return (
    <TaskProvider>
      <TaskBoard />
    </TaskProvider>
  );
}

export default App;
