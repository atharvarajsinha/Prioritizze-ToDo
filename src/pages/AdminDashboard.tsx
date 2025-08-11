import React, { useEffect } from 'react';
import { Users, Target, MessageSquare, TrendingUp, Activity, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/ui/Button';
import { TestimonialCard } from '../components/admin/TestimonialCard';
import { TestimonialForm } from '../components/admin/TestimonialForm';
import { useApi } from '../hooks/useApi';
import { statsApi, testimonialsApi } from '../services/api';
import type { Stats, Testimonial } from '../types';

export function AdminDashboard() {
  const statsQuery = useApi<Stats>();
  const testimonialsQuery = useApi<Testimonial[]>();
  const testimonialMutation = useApi<Testimonial>();
  
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
  const [selectedTestimonial, setSelectedTestimonial] = React.useState<Testimonial | null>(null);
  const [isTestimonialFormOpen, setIsTestimonialFormOpen] = React.useState(false);

  useEffect(() => {
    statsQuery.execute(() => statsApi.getAdminStats());
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const response = await testimonialsQuery.execute(() => testimonialsApi.getTestimonials());
      console.log(response.data);
      if (response.data.results.success) {
        setTestimonials(response.data.results.data);
      }
    } catch (error) {
      toast.error('Failed to load testimonials');
    }
  };

  const handleCreateTestimonial = async (data: any) => {
    try {
      const response = await testimonialMutation.execute(() => 
        testimonialsApi.createTestimonial(data)
      );
      if (response.data.success) {
        setTestimonials(prev => [...prev, response.data.data]);
        setIsTestimonialFormOpen(false);
        toast.success('Testimonial created successfully');
      }
    } catch (error) {
      toast.error('Failed to create testimonial');
    }
  };

  const handleUpdateTestimonial = async (data: any) => {
    if (!selectedTestimonial) return;
    
    try {
      const response = await testimonialMutation.execute(() => 
        testimonialsApi.updateTestimonial(selectedTestimonial.id, data)
      );
      if (response.data.success) {
        setTestimonials(prev => prev.map(testimonial => 
          testimonial.id === selectedTestimonial.id ? response.data.data : testimonial
        ));
        setSelectedTestimonial(null);
        setIsTestimonialFormOpen(false);
        toast.success('Testimonial updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update testimonial');
    }
  };

  const handleDeleteTestimonial = async (testimonial: Testimonial) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await testimonialsApi.deleteTestimonial(testimonial.id);
      setTestimonials(prev => prev.filter(t => t.id !== testimonial.id));
      toast.success('Testimonial deleted successfully');
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  };

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

        {/* Testimonials Management */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Testimonials Management
            </h2>
            <Button onClick={() => {
              setSelectedTestimonial(null);
              setIsTestimonialFormOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                onEdit={(testimonial) => {
                  setSelectedTestimonial(testimonial);
                  setIsTestimonialFormOpen(true);
                }}
                onDelete={handleDeleteTestimonial}
              />
            ))}
          </div>

          {testimonials.length === 0 && !testimonialsQuery.loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No testimonials found</p>
            </div>
          )}
        </div>

        {/* Testimonial Form Modal */}
        <TestimonialForm
          isOpen={isTestimonialFormOpen}
          onClose={() => {
            setIsTestimonialFormOpen(false);
            setSelectedTestimonial(null);
          }}
          onSubmit={selectedTestimonial ? handleUpdateTestimonial : handleCreateTestimonial}
          testimonial={selectedTestimonial || undefined}
          isLoading={testimonialMutation.loading}
        />

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