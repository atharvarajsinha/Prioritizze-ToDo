import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Bell, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/ui/Button';
import { ReminderForm } from '../components/dashboard/ReminderForm';
import { useApi } from '../hooks/useApi';
import { remindersApi, tasksApi } from '../services/api';
import type { Reminder, Task } from '../types';

export function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [isReminderFormOpen, setIsReminderFormOpen] = useState(false);

  const remindersQuery = useApi<Reminder[]>();
  const tasksQuery = useApi<Task[]>();
  const reminderMutation = useApi<Reminder>();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [remindersResponse, tasksResponse] = await Promise.all([
        remindersQuery.execute(() => remindersApi.getReminders()),
        tasksQuery.execute(() => tasksApi.getTasks()),
      ]);

      if (remindersResponse.data.success) {
        setReminders(remindersResponse.data.data);
      }
      if (tasksResponse.data.success) {
        setTasks(tasksResponse.data.data);
      }
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleCreateReminder = async (data: any) => {
    try {
      const reminderDateTime = `${data.reminderDate}T${data.reminderTime}:00`;
      const reminderData = {
        ...data,
        reminderDateTime,
      };
      delete reminderData.reminderDate;
      delete reminderData.reminderTime;

      const response = await reminderMutation.execute(() => 
        remindersApi.createReminder(reminderData)
      );
      if (response.data.success) {
        setReminders(prev => [...prev, response.data.data]);
        setIsReminderFormOpen(false);
        toast.success('Reminder created successfully');
      }
    } catch (error) {
      toast.error('Failed to create reminder');
    }
  };

  const handleEditReminder = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setIsReminderFormOpen(true);
  };

  const handleUpdateReminder = async (data: any) => {
    if (!selectedReminder) return;
    
    try {
      const reminderDateTime = `${data.reminderDate}T${data.reminderTime}:00`;
      const reminderData = {
        ...data,
        reminderDateTime,
      };
      delete reminderData.reminderDate;
      delete reminderData.reminderTime;

      const response = await reminderMutation.execute(() => 
        remindersApi.updateReminder(selectedReminder.id, reminderData)
      );
      if (response.data.success) {
        setReminders(prev => prev.map(reminder => 
          reminder.id === selectedReminder.id ? response.data.data : reminder
        ));
        setSelectedReminder(null);
        setIsReminderFormOpen(false);
        toast.success('Reminder updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update reminder');
    }
  };

  const handleDeleteReminder = async (reminder: Reminder) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;

    try {
      await remindersApi.deleteReminder(reminder.id);
      setReminders(prev => prev.filter(r => r.id !== reminder.id));
      toast.success('Reminder deleted successfully');
    } catch (error) {
      toast.error('Failed to delete reminder');
    }
  };

  const getTaskTitle = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task?.title || 'Unknown Task';
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Reminders
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Never miss important deadlines with smart reminders
            </p>
          </div>
          <Button onClick={() => {
            setSelectedReminder(null);
            setIsReminderFormOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Reminder
          </Button>
        </div>

        {/* Reminders List */}
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {getTaskTitle(reminder.taskId)}
                    </h3>
                    {reminder.isTriggered && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full">
                        Triggered
                      </span>
                    )}
                  </div>
                  
                  {reminder.message && (
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {reminder.message}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(new Date(reminder.reminderDateTime), 'MMM dd, yyyy')}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      {format(new Date(reminder.reminderDateTime), 'HH:mm')}
                    </div>

                    {reminder.isEmailNotification && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full">
                        Email Notification
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditReminder(reminder)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteReminder(reminder)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {reminders.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No reminders yet</p>
              <p className="text-gray-400 dark:text-gray-500">Create your first reminder to never miss important deadlines</p>
            </div>
          )}
        </div>

        {/* Reminder Form Modal */}
        <ReminderForm
          isOpen={isReminderFormOpen}
          onClose={() => {
            setIsReminderFormOpen(false);
            setSelectedReminder(null);
          }}
          onSubmit={selectedReminder ? handleUpdateReminder : handleCreateReminder}
          reminder={selectedReminder || undefined}
          tasks={tasks.map(task => ({ id: task.id, title: task.title }))}
          isLoading={reminderMutation.loading}
        />
      </div>
    </Layout>
  );
}