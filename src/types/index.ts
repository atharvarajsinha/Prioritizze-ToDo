export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  categoryId?: string;
  dueDate?: string;
  isRecurring: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  taskCount: number;
}

export interface Stats {
  totalUsers: number;
  totalTasks: number;
  completedTasks: number;
  reach: number;
  feedbackCount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface Feedback {
  id: string;
  type: 'bug' | 'feature' | 'feedback';
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
}

export interface Reminder {
  id: string;
  taskId: string;
  reminderDateTime: string;
  message?: string;
  isEmailNotification: boolean;
  isTriggered: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}