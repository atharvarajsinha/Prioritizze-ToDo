import React, { useEffect } from 'react';
import { Users, Target, MessageSquare, TrendingUp, Activity } from 'lucide-react';
import { Layout } from '../components/common/Layout';
import { useApi } from '../hooks/useApi';
import { statsApi } from '../services/api';
import type { Stats } from '../types';

export function AdminDashboard() {
  const statsQuery = useApi<Stats>();

  useEffect(() => {
    statsQuery.execute(() => statsApi.getAdminStats());
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of platform statistics and user activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {statsQuery.data?.totalUsers?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Tasks
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {statsQuery.data?.totalTasks?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completed Tasks
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {statsQuery.data?.completedTasks?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Platform Reach
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {statsQuery.data?.reach?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Feedback
              </h2>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {statsQuery.data?.feedbackCount?.toLocaleString() || '0'}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Total feedback submissions received
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Activity className="h-5 w-5 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Completion Rate
              </h2>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {statsQuery.data?.totalTasks && statsQuery.data?.completedTasks
                ? Math.round((statsQuery.data.completedTasks / statsQuery.data.totalTasks) * 100)
                : 0}%
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Average task completion rate across all users
            </p>
          </div>
        </div>

        {statsQuery.loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading statistics...</p>
          </div>
        )}

        {statsQuery.error && (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{statsQuery.error}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}