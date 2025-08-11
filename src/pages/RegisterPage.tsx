import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { CheckSquare } from 'lucide-react';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../services/api';
import { ROUTES } from '../utils/constants';

const registerSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  mobile: yup.string().required('Mobile number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      const response = await authApi.register(registerData);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        login(token, user);
        toast.success('Registration successful!');
        
        // Redirect based on user role
        if (user.role === 'admin') {
          navigate(ROUTES.ADMIN_DASHBOARD);
        } else {
          navigate(ROUTES.USER_DASHBOARD);
        }
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <CheckSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join Prioritizze and start organizing your life
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg px-8 py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Mobile Number"
                type="tel"
                placeholder="Enter your mobile number"
                error={errors.mobile?.message}
                {...register('mobile')}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                error={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to={ROUTES.LOGIN}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}