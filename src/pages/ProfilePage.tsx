import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { User, Camera, Target, CheckCircle, Clock } from 'lucide-react';
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

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {stats.recentTasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {task.title}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : task.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}