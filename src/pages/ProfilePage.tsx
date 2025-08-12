import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { User, Camera, Target, CheckCircle, Clock, Calendar } from 'lucide-react';
import { format, parseISO, isSameDay } from 'date-fns';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { userApi } from '../services/api';
import type { Task } from '../types';

const profileSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  mobile: yup.string().required('Mobile number is required'),
});

type ProfileFormData = yup.InferType<typeof profileSchema>;

interface UserStats {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  recentTasks: Task[];
}

interface ActivityItem {
  id: string;
  type: 'created' | 'updated' | 'completed';
  taskTitle: string;
  date: string;
}
export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const userStatsQuery = useApi<UserStats>();
  const updateProfileMutation = useApi<any>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
    },
  });

  useEffect(() => {
    userStatsQuery.execute(() => userApi.getUserStats());
  }, []);
  
  useEffect(() => {
    if (userStatsQuery.data?.recentTasks) {
      generateActivities(userStatsQuery.data.recentTasks);
    }
  }, [userStatsQuery.data]);
  
  const generateActivities = (tasks: Task[]) => {
    const activityItems: ActivityItem[] = [];
    
    tasks.forEach(task => {
      // Add created activity
      activityItems.push({
        id: `${task.id}-created`,
        type: 'created',
        taskTitle: task.title,
        date: task.createdAt,
      });
      
      // Add updated activity if different from created
      if (task.updatedAt !== task.createdAt) {
        activityItems.push({
          id: `${task.id}-updated`,
          type: task.status === 'completed' ? 'completed' : 'updated',
          taskTitle: task.title,
          date: task.updatedAt,
        });
      }
    });
    
    // Sort by date descending
    activityItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setActivities(activityItems);
  };
  
  const groupActivitiesByDate = (activities: ActivityItem[]) => {
    const grouped: { [key: string]: ActivityItem[] } = {};
    
    activities.forEach(activity => {
      const dateKey = format(parseISO(activity.date), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(activity);
    });
    
    return grouped;
  };
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created':
        return <Target className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };
  
  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'created':
        return `Task "${activity.taskTitle}" created`;
      case 'completed':
        return `Task "${activity.taskTitle}" completed`;
      default:
        return `Task "${activity.taskTitle}" updated`;
    }
  };

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      });
    }
  }, [user, reset]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await userApi.uploadAvatar(file);
      if (response.data.success) {
        updateUser({ avatar: response.data.data.avatar });
        toast.success('Avatar updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update avatar');
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const response = await updateProfileMutation.execute(() =>
        userApi.updateProfile(data)
      );
      
      if (response.data.success) {
        updateUser(response.data.data);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const stats = userStatsQuery.data;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and view your task statistics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Profile Information
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              {/* Avatar */}
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-500" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="w-3 h-3" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  error={errors.name?.message}
                  disabled={!isEditing}
                  {...register('name')}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  error={errors.email?.message}
                  disabled={!isEditing}
                  {...register('email')}
                />

                <Input
                  label="Mobile Number"
                  type="tel"
                  placeholder="Enter your mobile number"
                  error={errors.mobile?.message}
                  disabled={!isEditing}
                  {...register('mobile')}
                />

                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isLoading={updateProfileMutation.loading}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Statistics */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Task Statistics
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Total Tasks
                    </span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {stats?.totalTasks || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Pending Tasks
                    </span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">
                    {stats?.pendingTasks || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Completed Tasks
                    </span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {stats?.completedTasks || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Tasks */}
            {stats?.recentTasks && stats.recentTasks.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Recent Activity Timeline
                </h3>
                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {Object.entries(groupActivitiesByDate(activities)).map(([dateKey, dayActivities]) => (
                    <div key={dateKey} className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                        <Calendar className="h-4 w-4" />
                        {format(parseISO(dateKey), 'MMM dd, yyyy')}
                      </div>
                      <div className="ml-6 space-y-2">
                        {dayActivities.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            {getActivityIcon(activity.type)}
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {getActivityText(activity)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                              {format(parseISO(activity.date), 'HH:mm')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {activities.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No recent activity
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}