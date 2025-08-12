import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Flag, Clock, AlertTriangle } from 'lucide-react';
import { format, isPast } from 'date-fns';
import toast from 'react-hot-toast';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TaskForm } from '../components/dashboard/TaskForm';
import { useApi } from '../hooks/useApi';
import { tasksApi, categoriesApi } from '../services/api';
import { PRIORITY_COLORS, STATUS_COLORS } from '../utils/constants';
import type { Task, Category } from '../types';

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    priority: '',
  });

  const tasksQuery = useApi<Task[]>();
  const categoriesQuery = useApi<Category[]>();
  const taskMutation = useApi<Task>();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksResponse, categoriesResponse] = await Promise.all([
        tasksQuery.execute(() => tasksApi.getTasks()),
        categoriesQuery.execute(() => categoriesApi.getCategories()),
      ]);

      if (tasksResponse.data.success) {
        setTasks(tasksResponse.data.data);
      }
      if (categoriesResponse.data.success) {
        setCategories(categoriesResponse.data.data);
      }
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleCreateTask = async (data: any) => {
    try {
      const response = await taskMutation.execute(() => tasksApi.createTask(data));
      if (response.data.success) {
        setTasks(prev => [...prev, response.data.data]);
        setIsTaskFormOpen(false);
        toast.success('Task created successfully');
      }
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleEditTask = async (task: Task) => {
    try {
      const response = await tasksApi.getTask(task.id);
      if (response.data.success) {
        setSelectedTask(response.data.data);
        setIsTaskFormOpen(true);
      }
    } catch (error) {
      toast.error('Failed to load task details');
    }
  };

  const handleUpdateTask = async (data: any) => {
    if (!selectedTask) return;
    
    try {
      const response = await taskMutation.execute(() => 
        tasksApi.updateTask(selectedTask.id, data)
      );
      if (response.data.success) {
        setTasks(prev => prev.map(task => 
          task.id === selectedTask.id ? response.data.data : task
        ));
        setSelectedTask(null);
        setIsTaskFormOpen(false);
        toast.success('Task updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await tasksApi.deleteTask(task.id);
      setTasks(prev => prev.filter(t => t.id !== task.id));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (task: Task, status: Task['status']) => {
    try {
      const response = await tasksApi.updateTask(task.id, { status });
      if (response.data.success) {
        setTasks(prev => prev.map(t => 
          t.id === task.id ? { ...t, status } : t
        ));
        toast.success('Task status updated');
      }
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const isOverdue = (task: Task) => {
    return task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed';
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = !filters.status || task.status === filters.status;
    const matchesCategory = !filters.category || task.categoryId === filters.category;
    const matchesPriority = !filters.priority || task.priority === filters.priority;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and organize your tasks
            </p>
          </div>
          <Button onClick={() => {
            setSelectedTask(null);
            setIsTaskFormOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
            
            <select
              className="h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              className="h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <select
              className="h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${
                isOverdue(task) ? 'border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {task.title}
                    </h3>
                    {isOverdue(task) && (
                      <div className="flex items-center text-red-600 dark:text-red-400">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Overdue</span>
                      </div>
                    )}
                  </div>
                  
                  {task.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${PRIORITY_COLORS[task.priority]}`}>
                      <Flag className="h-3 w-3 inline mr-1" />
                      {task.priority}
                    </span>
                    
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[task.status]}`}>
                      {task.status.replace('_', ' ')}
                    </span>

                    {task.dueDate && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </div>
                    )}

                    {task.isRecurring && (
                      <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                        <Clock className="h-4 w-4 mr-1" />
                        Recurring ({task.recurringType})
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {task.status !== 'todo' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(task, 'todo')}
                      >
                        To Do
                      </Button>
                    )}
                    {task.status !== 'in_progress' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(task, 'in_progress')}
                      >
                        In Progress
                      </Button>
                    )}
                    {task.status !== 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(task, 'completed')}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTask(task)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTask(task)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
            </div>
          )}
        </div>

        {/* Task Form Modal */}
        <TaskForm
          isOpen={isTaskFormOpen}
          onClose={() => {
            setIsTaskFormOpen(false);
            setSelectedTask(null);
          }}
          onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
          task={selectedTask || undefined}
          categories={categories}
          isLoading={taskMutation.loading}
        />
      </div>
    </Layout>
  );
}