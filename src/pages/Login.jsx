import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, LogIn, Shield, Eye, EyeOff, Calendar, Sun } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const { dark, toggleDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password })
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem('token', result.token);
        toast.success('Login successful!');
        window.location.href = '/dashboard';
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-dark transition-colors duration-200 flex flex-col lg:flex-row">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1a1a2e',
          color: '#fff',
          border: '1px solid #333',
        },
      }} />

      {/* Left illustration panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-dark-50 relative overflow-hidden items-center justify-center border-r border-gray-800">
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <div className="absolute top-8 left-8 z-10">
          <img src="/logo.png" alt="Logo" className="dark:brightness-0 dark:invert w-32" />
        </div>
        <div className="text-center max-w-md z-10">
          <h1 className="text-3xl font-bold text-white mb-4">Welcome to Wix Capital</h1>
          <p className="text-gray-400">
            Our platform offers secure trading, real‑time market data, and expert insights to help you achieve your financial goals.
          </p>
        </div>
        {/* Decorative floating elements */}
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-20 left-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={toggleDark}
            className="p-2 rounded-full bg-dark-100 border border-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            {dark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-dark-50/90 border border-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white text-center">User Login</h2>
              <p className="mt-1 text-sm text-gray-400 text-center">Sign in to your account to continue</p>
            </div>

            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Username or Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="email"
                      type="text"
                      {...register('email', { required: 'Email or username is required' })}
                      className="block w-full pl-10 pr-3 py-3 bg-dark-100 border border-gray-800 rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors placeholder-gray-500"
                      placeholder="you@example.com or username"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', { required: 'Password is required' })}
                      className="block w-full pl-10 pr-10 py-3 bg-dark-100 border border-gray-800 rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors placeholder-gray-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      {...register('remember')}
                      className="h-4 w-4 bg-dark-100 border-gray-800 rounded focus:ring-primary accent-primary"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                      Remember me
                    </label>
                  </div>
                  <a href="/forgot-password" className="text-sm font-medium text-primary hover:text-primary-400 transition-colors">
                    Forgot password?
                  </a>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    <span className="font-medium">Sign In</span>
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-400">
                    Don't have an account?{' '}
                    <a href="/register" className="font-medium text-primary hover:text-primary-400 transition-colors">
                    Sign up now
                    </a>
                </p>
                </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center text-xs text-gray-500">
              <Shield className="h-3 w-3 mr-1" />
              <span>Secure login – Your data is protected</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-dot-pattern {
          background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default Login;