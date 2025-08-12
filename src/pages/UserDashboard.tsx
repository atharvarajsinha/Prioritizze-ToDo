import React, { useEffect, useState } from 'react';
import { Calendar, Clock, AlertCircle, Bell, CheckSquare, Target, Tag } from 'lucide-react';
import { format, isPast, isBefore, startOfDay } from 'date-fns';
import toast from 'react-hot-toast';
import { Layout } from '../components/common/Layout';
import { useApi } from '../hooks/useApi';
import { tasksApi, remindersApi, categoriesApi } from '../services/api';
import { STATUS_COLORS, PRIORITY_COLORS } from '../utils/constants';
import type { Task, Reminder, Category } from '../types';

export function UserDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const tasksQuery = useApi<Task[]>();
  const dueTasks = useApi<Task[]>();
  const recurringTasks = useApi<Task[]>();
  const upcomingReminders = useApi<Reminder[]>();
  const categoriesQuery = useApi<Category[]>();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksResponse, dueResponse, recurringResponse, remindersResponse, categoriesResponse] = await Promise.all([
        tasksQuery.execute(() => tasksApi.getTasks()),
        dueTasks.execute(() => tasksApi.getDueTasks()),
        recurringTasks.execute(() => tasksApi.getRecurringTasks()),
        upcomingReminders.execute(() => remindersApi.getUpcomingReminders()),
        categoriesQuery.execute(() => categoriesApi.getCategories()),
      ]);

      if (tasksResponse.data.success) {
        setTasks(tasksResponse.data.data);
      }
      if (remindersResponse.data.success) {
        setReminders(remindersResponse.data.data);
      }
      if (categoriesResponse.data.success) {
        setCategories(categoriesResponse.data.data);
      }
    } catch (error) {
      toast.error('Failed to load data');
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
  
  const isPending = (task: Task) => {
    const today = startOfDay(new Date());
    const updatedAt = new Date(task.updatedAt);
    return isBefore(updatedAt, today);
  };
  
  const getCategoryInfo = (categoryId?: string) => {
    if (!categoryId) return null;
    return categories.find(cat => cat.id === categoryId);
  };

  const tasksByStatus = {
    todo: tasks.filter(task => task.status === 'todo'),
    in_progress: tasks.filter(task => task.status === 'in_progress'),
    completed: tasks.filter(task => task.status === 'completed'),
  };

  const overdueTasks = tasks.filter(isOverdue);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's an overview of your tasks and progress.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  To Do
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {tasksByStatus.todo.length}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  In Progress
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {tasksByStatus.in_progress.length}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completed
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {tasksByStatus.completed.length}
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckSquare className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Overdue
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {overdueTasks.length}
                </p>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {overdueTasks.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
              <span className="font-medium text-red-800 dark:text-red-200">
                You have {overdueTasks.length} overdue task{overdueTasks.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {reminders.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="font-medium text-blue-800 dark:text-blue-200">
                You have {reminders.length} upcoming reminder{reminders.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* To Do Column */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <Target className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                To Do ({tasksByStatus.todo.length})
              </h2>
            </div>
            <div className="space-y-3">
              {tasksByStatus.todo.map((task) => {
                const category = getCategoryInfo(task.categoryId);
                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      isOverdue(task) 
                        ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/10' 
                        : isPending(task)
                        ? 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/10'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                        {task.title}
                      </h3>
                      <div className="flex gap-1">
                        <select
                          className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                          value={task.status}
                          onChange={(e) => handleStatusChange(task, e.target.value as Task['status'])}
                        >
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      {category && (
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          <Tag className="h-3 w-3 inline mr-1" />
                          {category.name}
                        </span>
                      )}
                    </div>

                    {task.dueDate && (
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(task.dueDate), 'MMM dd')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-yellow-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                In Progress ({tasksByStatus.in_progress.length})
              </h2>
            </div>
            <div className="space-y-3">
              {tasksByStatus.in_progress.map((task) => {
                const category = getCategoryInfo(task.categoryId);
                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      isOverdue(task) 
                        ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/10' 
                        : isPending(task)
                        ? 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/10'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                        {task.title}
                      </h3>
                      <div className="flex gap-1">
                        <select
                          className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                          value={task.status}
                          onChange={(e) => handleStatusChange(task, e.target.value as Task['status'])}
                        >
                          <option value="todo">To Do</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      {category && (
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          <Tag className="h-3 w-3 inline mr-1" />
                          {category.name}
                        </span>
                      )}
                    </div>

                    {task.dueDate && (
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(task.dueDate), 'MMM dd')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Completed Column */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <CheckSquare className="h-5 w-5 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Completed ({tasksByStatus.completed.length})
              </h2>
            </div>
            <div className="space-y-3">
              {tasksByStatus.completed.map((task) => {
                const category = getCategoryInfo(task.categoryId);
                return (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                        {task.title}
                      </h3>
                      <div className="flex gap-1">
                        <select
                          className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                          value={task.status}
                          onChange={(e) => handleStatusChange(task, e.target.value as Task['status'])}
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      {category && (
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          <Tag className="h-3 w-3 inline mr-1" />
                          {category.name}
                        </span>
                      )}
                    </div>

                    {task.dueDate && (
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(task.dueDate), 'MMM dd')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Reminders */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Upcoming Reminders
            </h2>
            <div className="space-y-4">
              {reminders.slice(0, 5).map((reminder) => (
                <div
                  key={reminder.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center mb-2">
                    <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Task Reminder
                    </h3>
                  </div>
                  
                  {reminder.message && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {reminder.message}
                    </p>
                  )}

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(reminder.reminderDateTime), 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>
              ))}

              {reminders.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No upcoming reminders
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}