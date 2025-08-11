import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { MessageSquare, Bug, Lightbulb, Heart } from 'lucide-react';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { feedbackApi } from '../services/api';

const feedbackSchema = yup.object().shape({
  type: yup.string().oneOf(['feedback', 'bug', 'feature']).required('Type is required'),
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
});

type FeedbackFormData = yup.InferType<typeof feedbackSchema>;

export function FeedbackPage() {
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: yupResolver(feedbackSchema),
    defaultValues: {
      type: 'feedback',
    },
  });

  const selectedType = watch('type');

  const onSubmit = async (data: FeedbackFormData) => {
    setIsLoading(true);
    try {
      const response = await feedbackApi.submitFeedback(data);
      if (response.data.success) {
        toast.success('Thank you for your feedback!');
        reset();
      } else {
        toast.error('Failed to submit feedback');
      }
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const feedbackTypes = [
    {
      id: 'feedback',
      label: 'General Feedback',
      description: 'Share your thoughts about the app',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    },
    {
      id: 'bug',
      label: 'Report a Bug',
      description: 'Something not working as expected?',
      icon: Bug,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
    },
    {
      id: 'feature',
      label: 'Feature Request',
      description: 'Suggest a new feature or improvement',
      icon: Lightbulb,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <MessageSquare className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            We'd Love to Hear From You
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your feedback helps us improve Prioritizze and create the best possible 
            experience for our users. Tell us what you think!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feedback Types */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              What would you like to share?
            </h2>
            <div className="space-y-4">
              {feedbackTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <div
                    key={type.id}
                    className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                      selectedType === type.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => {
                      // This would need to be handled by the form
                    }}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`p-2 rounded-lg ${type.bgColor} mr-3`}>
                        <IconComponent className={`h-5 w-5 ${type.color}`} />
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {type.label}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {type.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Share Your Feedback
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Feedback Type
                  </label>
                  <select
                    className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register('type')}
                  >
                    <option value="feedback">General Feedback</option>
                    <option value="bug">Report a Bug</option>
                    <option value="feature">Feature Request</option>
                  </select>
                  {errors.type && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.type.message}
                    </p>
                  )}
                </div>

                <Input
                  label="Title"
                  placeholder={
                    selectedType === 'bug'
                      ? 'Brief description of the bug'
                      : selectedType === 'feature'
                      ? 'What feature would you like to see?'
                      : 'What would you like to tell us?'
                  }
                  error={errors.title?.message}
                  {...register('title')}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder={
                      selectedType === 'bug'
                        ? 'Please describe the bug in detail. What steps did you take? What did you expect to happen? What actually happened?'
                        : selectedType === 'feature'
                        ? 'Describe the feature you would like to see. How would it work? How would it help you?'
                        : 'Share your thoughts, suggestions, or any other feedback you have about Prioritizze.'
                    }
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full"
                >
                  Submit Feedback
                </Button>
              </form>
            </div>

            {/* Additional Info */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                What happens next?
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• We review all feedback within 48 hours</li>
                <li>• Bug reports are prioritized for our development team</li>
                <li>• Popular feature requests are considered for our roadmap</li>
                <li>• You may receive a follow-up email if we need more details</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}