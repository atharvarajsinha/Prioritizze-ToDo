import React, { useEffect, useState } from 'react';
import { MessageSquare, Bug, Lightbulb, Heart, Filter, Eye } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Layout } from '../components/common/Layout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useApi } from '../hooks/useApi';
import { feedbackApi } from '../services/api';
import type { Feedback } from '../types';

export function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    startDate: '',
    endDate: '',
  });
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const feedbackQuery = useApi<Feedback[]>();
  const feedbackDetailQuery = useApi<Feedback>();

  useEffect(() => {
    loadFeedback();
  }, []);

  useEffect(() => {
    filterFeedback();
  }, [feedback, filters]);

  const loadFeedback = async () => {
    try {
      const params = {
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      };
      const response = await feedbackQuery.execute(() => feedbackApi.getFeedback(params));
      if (response.data.success) {
        setFeedback(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load feedback');
    }
  };

  const filterFeedback = () => {
    let filtered = feedback;

    if (filters.search) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(item => item.type === filters.type);
    }
    
    if (filters.startDate) {
      filtered = filtered.filter(item => 
        new Date(item.createdAt) >= new Date(filters.startDate)
      );
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(item => 
        new Date(item.createdAt) <= new Date(filters.endDate)
      );
    }

    setFilteredFeedback(filtered);
  };
  
  const handleViewFeedback = async (feedbackId: string) => {
    try {
      const response = await feedbackDetailQuery.execute(() => 
        feedbackApi.getFeedbackById(feedbackId)
      );
      if (response.data.success) {
        setSelectedFeedback(response.data.data);
        setIsViewModalOpen(true);
      }
    } catch (error) {
      toast.error('Failed to load feedback details');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug':
        return <Bug className="h-5 w-5 text-red-600" />;
      case 'feature':
        return <Lightbulb className="h-5 w-5 text-yellow-600" />;
      default:
        return <Heart className="h-5 w-5 text-pink-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'feature':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Feedback Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and manage user feedback, bug reports, and feature requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {feedback.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Feedback</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-red-600">
              {feedback.filter(f => f.type === 'bug').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Bug Reports</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-yellow-600">
              {feedback.filter(f => f.type === 'feature').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Feature Requests</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">Filters</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search feedback..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
            
            <select
              className="h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="">All Types</option>
              <option value="feedback">General Feedback</option>
              <option value="bug">Bug Reports</option>
              <option value="feature">Feature Requests</option>
            </select>
            
            <div className="flex gap-2">
              <Input
                type="date"
                placeholder="Start Date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
              <Input
                type="date"
                placeholder="End Date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Feedback Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredFeedback.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTypeIcon(item.type)}
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}>
                          {item.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                        {item.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewFeedback(item.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredFeedback.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No feedback found</p>
            </div>
          )}
        </div>
        
        {/* View Feedback Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedFeedback(null);
          }}
          title="Feedback Details"
          size="lg"
        >
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getTypeIcon(selectedFeedback.type)}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedFeedback.type)}`}>
                  {selectedFeedback.type}
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300">
                  {selectedFeedback.status}
                </span>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedFeedback.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedFeedback.description}
                </p>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Submitted: {format(new Date(selectedFeedback.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                <p>Updated: {format(new Date(selectedFeedback.updatedAt), 'MMM dd, yyyy HH:mm')}</p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
}