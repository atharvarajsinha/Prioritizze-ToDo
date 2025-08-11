import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Testimonial } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

const testimonialSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  role: yup.string().required('Role is required'),
  content: yup.string().required('Content is required'),
  avatar: yup.string().url('Must be a valid URL').required('Avatar URL is required'),
});

type TestimonialFormData = yup.InferType<typeof testimonialSchema>;

interface TestimonialFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TestimonialFormData) => void;
  testimonial?: Testimonial;
  isLoading?: boolean;
}

export function TestimonialForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  testimonial, 
  isLoading 
}: TestimonialFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TestimonialFormData>({
    resolver: yupResolver(testimonialSchema),
    defaultValues: testimonial ? {
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      avatar: testimonial.avatar,
    } : {
      name: '',
      role: '',
      content: '',
      avatar: '',
    },
  });

  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={testimonial ? 'Edit Testimonial' : 'Create New Testimonial'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Name"
          placeholder="Enter person's name"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Role"
          placeholder="Enter person's role/title"
          error={errors.role?.message}
          {...register('role')}
        />

        <Input
          label="Avatar URL"
          placeholder="Enter avatar image URL"
          error={errors.avatar?.message}
          {...register('avatar')}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Testimonial Content
          </label>
          <textarea
            className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter testimonial content"
            {...register('content')}
          />
          {errors.content && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {testimonial ? 'Update Testimonial' : 'Create Testimonial'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}