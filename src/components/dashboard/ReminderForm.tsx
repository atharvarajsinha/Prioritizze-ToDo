import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Reminder } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

const reminderSchema = yup.object().shape({
  taskId: yup.string().required('Task is required'),
  reminderDate: yup.string().required('Reminder date is required'),
  reminderTime: yup.string().required('Reminder time is required'),
  message: yup.string(),
  isEmailNotification: yup.boolean(),
});

type ReminderFormData = yup.InferType<typeof reminderSchema>;

interface ReminderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReminderFormData) => void;
  reminder?: Reminder;
  tasks: Array<{ id: string; title: string }>;
  isLoading?: boolean;
}

export function ReminderForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  reminder, 
  tasks, 
  isLoading 
}: ReminderFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReminderFormData>({
    resolver: yupResolver(reminderSchema),
    defaultValues: reminder ? {
      taskId: reminder.taskId,
      reminderDate: reminder.reminderDateTime ? new Date(reminder.reminderDateTime).toISOString().split('T')[0] : '',
      reminderTime: reminder.reminderDateTime ? new Date(reminder.reminderDateTime).toTimeString().slice(0, 5) : '',
      message: reminder.message || '',
      is_email_notification: reminder.isEmailNotification,
    } : {
      taskId: '',
      reminderDate: '',
      reminderTime: '',
      message: '',
      is_email_notification: true,
    },
  });

  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={reminder ? 'Edit Reminder' : 'Create New Reminder'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Task
          </label>
          <select
            className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...register('taskId')}
          >
            <option value="">Select a task</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
          {errors.taskId && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {errors.taskId.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Reminder Date"
            type="date"
            error={errors.reminderDate?.message}
            {...register('reminderDate')}
          />

          <Input
            label="Reminder Time"
            type="time"
            error={errors.reminderTime?.message}
            {...register('reminderTime')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Custom Message (Optional)
          </label>
          <textarea
            className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter custom reminder message"
            {...register('message')}
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded border-gray-300 dark:border-gray-600"
              {...register('isEmailNotification')}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Send email notification
            </span>
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {reminder ? 'Update Reminder' : 'Create Reminder'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}