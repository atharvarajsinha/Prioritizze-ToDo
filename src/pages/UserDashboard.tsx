import React, { useEffect, useState } from 'react';
import { Plus, Filter, Search, Calendar, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TaskCard } from '../components/dashboard/TaskCard';
import { TaskForm } from '../components/dashboard/TaskForm';
import { useApi } from '../hooks/useApi';
import { tasksApi, categoriesApi } from '../services/api';
import type { Task, Category } from '../types';

export function UserDashboard() {
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
  const dueTasks = useApi<Task[]>();
  const recurringTasks = useApi<Task[]>();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksResponse, categoriesResponse, dueResponse, recurringResponse] = await Promise.all([
        tasksQuery.execute(() => tasksApi.getTasks()),
        categoriesQuery.execute(() => categoriesApi.getCategories()),
        dueTasks.execute(() => tasksApi.getDueTasks()),
        recurringTasks.execute(() => tasksApi.getRecurringTasks()),
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

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = !filters.status || task.status === filters.status;
    const matchesCategory = !filters.category || task.categoryId === filters.category;
    const matchesPriority = !filters.priority || task.priority === filters.priority;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const tasksByStatus = {
    todo: filteredTasks.filter(task => task.status === 'todo'),
    in_progress: filteredTasks.filter(task => task.status === 'in_progress'),
    completed: filteredTasks.filter(task => task.status === 'completed'),
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your tasks and stay organized
            </p>
          </div>
          <Button onClick={() => {
            setSelectedTask(null);
            setIsTaskFormOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600">
              {tasksByStatus.todo.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">To Do</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-yellow-600">
              {tasksByStatus.in_progress.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600">
              {tasksByStatus.completed.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-red-600">
              {dueTasks.data?.length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Due Soon</div>
          </div>
        </div>

        {/* Due Tasks Alert */}
        {dueTasks.data && dueTasks.data.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
              <span className="font-medium text-red-800 dark:text-red-200">
                You have {dueTasks.data.length} task(s) due soon
              </span>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">Filters</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            
            <select
              className="h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              className="h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* To Do */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              To Do ({tasksByStatus.todo.length})
            </h2>
            <div className="space-y-4">
              {tasksByStatus.todo.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={(task) => {
                    setSelectedTask(task);
                    setIsTaskFormOpen(true);
                  }}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
              {tasksByStatus.todo.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No tasks to do
                </div>
              )}
            </div>
          </div>

          {/* In Progress */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              In Progress ({tasksByStatus.in_progress.length})
            </h2>
            <div className="space-y-4">
              {tasksByStatus.in_progress.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={(task) => {
                    setSelectedTask(task);
                    setIsTaskFormOpen(true);
                  }}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
              {tasksByStatus.in_progress.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No tasks in progress
                </div>
              )}
            </div>
          </div>

          {/* Completed */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Completed ({tasksByStatus.completed.length})
            </h2>
            <div className="space-y-4">
              {tasksByStatus.completed.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={(task) => {
                    setSelectedTask(task);
                    setIsTaskFormOpen(true);
                  }}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
              {tasksByStatus.completed.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No completed tasks
                </div>
              )}
            </div>
          </div>
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