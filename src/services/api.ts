import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import type { 
  AuthResponse, 
  ApiResponse, 
  User, 
  Task, 
  Category, 
  Stats, 
  Testimonial, 
  Feedback,
  Reminder
} from '../types';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login/', { email, password }),
  
  register: (data: { name: string; email: string; mobile: string; password: string }) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register/', data),
  
  logout: () => api.post('/auth/logout/'),
};

export const statsApi = {
  getPublicStats: () => api.get<ApiResponse<Stats>>('/stats/public/'),
  getAdminStats: () => api.get<ApiResponse<Stats>>('/stats/admin/'),
};

export const testimonialsApi = {
  getTestimonials: () => api.get<ApiResponse<Testimonial[]>>('/testimonials/'),
  
  createTestimonial: (testimonial: Partial<Testimonial>) =>
    api.post<ApiResponse<Testimonial>>('/testimonials/create/', testimonial),
  
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) =>
    api.put<ApiResponse<Testimonial>>(`/testimonials/${id}/update/`, testimonial),
  
  deleteTestimonial: (id: string) => api.delete<ApiResponse<void>>(`/testimonials/${id}/delete/`),
};

export const tasksApi = {
  getTasks: (params?: { status?: string; category?: string; priority?: string }) =>
    api.get<ApiResponse<Task[]>>('/tasks/', { params }),
  
  getTask: (id: string) => api.get<ApiResponse<Task>>(`/tasks/${id}/`),
  
  createTask: (task: Partial<Task>) => api.post<ApiResponse<Task>>('/tasks/create/', task),
  
  updateTask: (id: string, task: Partial<Task>) =>
    api.put<ApiResponse<Task>>(`/tasks/${id}/update/`, task),
  
  deleteTask: (id: string) => api.delete<ApiResponse<void>>(`/tasks/${id}/delete/`),
  
  getDueTasks: () => api.get<ApiResponse<Task[]>>('/tasks/due/'),
  
  getRecurringTasks: () => api.get<ApiResponse<Task[]>>('/tasks/recurring/'),
};

export const categoriesApi = {
  getCategories: () => api.get<ApiResponse<Category[]>>('/categories/'),
  
  createCategory: (category: Partial<Category>) =>
    api.post<ApiResponse<Category>>('/categories/create/', category),
  
  updateCategory: (id: string, category: Partial<Category>) =>
    api.put<ApiResponse<Category>>(`/categories/${id}/update/`, category),
  
  deleteCategory: (id: string) => api.delete<ApiResponse<void>>(`/categories/${id}/delete/`),
};

export const userApi = {
  getProfile: () => api.get<ApiResponse<User>>('/profile/'),
  
  updateProfile: (data: Partial<User>) =>
    api.put<ApiResponse<User>>('/profile/update/', data),
  
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post<ApiResponse<{ avatar: string }>>('/profile/avatar/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  getUserStats: () => api.get<ApiResponse<{
    totalTasks: number;
    pendingTasks: number;
    completedTasks: number;
    recentTasks: Task[];
  }>>('/user/stats/'),
};

export const feedbackApi = {
  submitFeedback: (feedback: Partial<Feedback>) =>
    api.post<ApiResponse<Feedback>>('/feedback/create/', feedback),
  
  getFeedback: () => api.get<ApiResponse<Feedback[]>>('/feedback/'),
};

export const remindersApi = {
  getReminders: (taskId?: string) => 
    api.get<ApiResponse<Reminder[]>>('/reminders/', { params: { taskId } }),
  
  createReminder: (reminder: Partial<Reminder>) =>
    api.post<ApiResponse<Reminder>>('/reminders/create/', reminder),
  
  updateReminder: (id: string, reminder: Partial<Reminder>) =>
    api.put<ApiResponse<Reminder>>(`/reminders/${id}/update/`, reminder),
  
  deleteReminder: (id: string) => api.delete<ApiResponse<void>>(`/reminders/${id}/delete/`),
  
  getUpcomingReminders: () => api.get<ApiResponse<Reminder[]>>('/reminders/upcoming/'),
};

export default api;