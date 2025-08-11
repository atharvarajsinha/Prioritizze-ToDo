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

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data.email, data.password);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        login(token, user);
        toast.success('Login successful!');
        
        // Redirect based on user role
        if (user.role === 'admin') {
          navigate(ROUTES.ADMIN_DASHBOARD);
        } else {
          navigate(ROUTES.USER_DASHBOARD);
        }
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
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
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your Prioritizze account
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg px-8 py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password')}
              />

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  to={ROUTES.REGISTER}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}