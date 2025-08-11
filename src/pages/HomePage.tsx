import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Users, Target, MessageSquare, TrendingUp, CheckCircle, Calendar, Bell } from 'lucide-react';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/ui/Button';
import { useApi } from '../hooks/useApi';
import { statsApi, testimonialsApi } from '../services/api';
import { ROUTES } from '../utils/constants';
import type { Stats, Testimonial } from '../types';

export function HomePage() {
  const statsQuery = useApi<Stats>();
  const testimonialsQuery = useApi<Testimonial[]>();

  useEffect(() => {
    statsQuery.execute(() => statsApi.getPublicStats());
    testimonialsQuery.execute(() => testimonialsApi.getTestimonials());
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container relative mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <CheckSquare className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Organize Your Life with{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Prioritizze
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              The ultimate task management platform that helps you prioritize, organize, 
              and achieve your goals with intelligent features and beautiful design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={ROUTES.REGISTER}>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3">
                  Get Started Free
                </Button>
              </Link>
              <Link to={ROUTES.LOGIN}>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-3">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join our growing community of productive individuals and teams
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {statsQuery.data?.totalUsers?.toLocaleString() || '0'}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Active Users</div>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {statsQuery.data?.completedTasks?.toLocaleString() || '0'}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Tasks Completed</div>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {statsQuery.data?.reach?.toLocaleString() || '0'}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Global Reach</div>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <MessageSquare className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {statsQuery.data?.feedbackCount?.toLocaleString() || '0'}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Feedback Received</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to stay organized and productive
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-3">
                  Task Management
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Create, organize, and track your tasks with priorities, categories, and status updates.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-3">
                  Due Dates & Recurring
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Set due dates and create recurring tasks to stay on top of your regular activities.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Bell className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-3">
                  Smart Reminders
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Get email notifications and reminders to never miss important deadlines again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonialsQuery.data && testimonialsQuery.data.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                What Our Users Say
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Don't just take our word for it - here's what our community thinks
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonialsQuery.data.slice(0, 3).map((testimonial) => (
                <div key={testimonial.id} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Organized?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their productivity with Prioritizze.
            Start your journey today, completely free.
          </p>
          <Link to={ROUTES.REGISTER}>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}