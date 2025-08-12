import { tasksApi } from '../services/api';

let recurringTaskInterval: ReturnType<typeof setInterval> | null = null;

export const handleRecurringTasks = async () => {
  try {
    const response = await tasksApi.getRecurringTasks();
    if (!response.data.success) return;

    const recurringTasks = response.data.data;
    const now = new Date();

    for (const task of recurringTasks) {
      if (!task.isRecurring || !task.recurringType) continue;

      const lastUpdate = new Date(task.updatedAt);
      const nextResetDate = getNextResetDate(lastUpdate, task.recurringType);

      if (now >= nextResetDate && task.status !== 'todo') {
        await tasksApi.updateTask(task.id, { status: 'todo' });
      }
    }
  } catch (error) {
    console.error('Error handling recurring tasks:', error);
  }
};

const getNextResetDate = (lastUpdate: Date, recurringType: string): Date => {
  const nextReset = new Date(lastUpdate);
  
  switch (recurringType) {
    case 'daily':
      nextReset.setDate(nextReset.getDate() + 1);
      break;
    case 'weekly':
      nextReset.setDate(nextReset.getDate() + 7);
      break;
    case 'monthly':
      nextReset.setMonth(nextReset.getMonth() + 1);
      break;
    default:
      return nextReset;
  }
  
  nextReset.setHours(0, 0, 0, 0);
  return nextReset;
};

export const initRecurringTaskHandler = () => {
  // Clear existing interval if any
  if (recurringTaskInterval) {
    clearInterval(recurringTaskInterval);
  }

  // Check every hour (60 minutes * 60 seconds * 1000 milliseconds)
  recurringTaskInterval = setInterval(handleRecurringTasks, 60 * 60 * 1000);
  
  // Run immediately on initialization
  handleRecurringTasks();

  // Return cleanup function
  return () => {
    if (recurringTaskInterval) {
      clearInterval(recurringTaskInterval);
      recurringTaskInterval = null;
    }
  };
};