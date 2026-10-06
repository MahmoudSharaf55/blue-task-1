const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const taskRoutes = require('./src/routes/task.routes');
const errorHandler = require('./src/middlewares/error.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root & Health routes
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Task Management API',
    endpoints: {
      tasks: '/tasks',
      health: '/api/health',
    },
  });
});

// Task Routes
app.use('/tasks', taskRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
