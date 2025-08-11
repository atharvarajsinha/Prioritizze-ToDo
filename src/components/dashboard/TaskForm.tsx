import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Task, Category } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

const taskSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  priority: yup.string().oneOf(['low', 'medium', 'high']).required('Priority is required'),
  categoryId: yup.string(),
  dueDate: yup.string(),
  isRecurring: yup.boolean(),
  recurringType: yup.string().oneOf(['daily', 'weekly', 'monthly']),
});

type TaskFormData = yup.InferType<typeof taskSchema>;

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  task?: Task;
  categories: Category[];
  isLoading?: boolean;
}

export function TaskForm({ isOpen, onClose, onSubmit, task, categories, isLoading }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: yupResolver(taskSchema),
    defaultValues: task ? {
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      categoryId: task.categoryId || '',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      isRecurring: task.isRecurring,
      recurringType: task.recurringType || 'weekly',
    } : {
      priority: 'medium',
      isRecurring: false,
      recurringType: 'weekly',
    },
  });

  const isRecurring = watch('isRecurring');

  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Task Title"
          placeholder="Enter task title"
          error={errors.title?.message}
          {...register('title')}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter task description"
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('priority')}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.priority.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('categoryId')}
            >
              <option value="">No Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Due Date"
          type="date"
          {...register('dueDate')}
        />

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded border-gray-300 dark:border-gray-600"
              {...register('isRecurring')}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Make this a recurring task
            </span>
          </label>
        </div>

        {isRecurring && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recurring Type
            </label>
            <select
              className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('recurringType')}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}