import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  User, UserCheck, Mail, Phone, Lock, Sun, MapPin, Users, UserPlus, Shield, Eye, EyeOff, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const countries = [
  { code: 'US', name: 'United States of America' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'NG', name: 'Nigeria' },
];

const Register = () => {
  const { dark, toggleDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem('token', result.token);
        toast.success('Registration successful!');
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
      {/* Left illustration panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-dark-50 relative overflow-hidden items-center justify-center border-r border-gray-800">
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <div className="absolute top-8 left-8 z-10">
          <img src="/logo.png" alt="Logo" className="dark:brightness-0 dark:invert w-32" />
        </div>
        <div className="text-center max-w-md z-10">
          <h1 className="text-3xl font-bold text-white mb-4">Invest with Confidence</h1>
          <p className="text-gray-400">
            Take control of your financial future with our transparent and secure investment platform.
          </p>
        </div>
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
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-dark-50/90 border border-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white text-center">Create an Account</h2>
              <p className="mt-1 text-sm text-gray-400 text-center">Fill in your details to get started</p>
            </div>

            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-5">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        {...register('username', { required: 'Username is required' })}
                        className="block w-full pl-10 pr-3 py-3 bg-dark-100 border border-gray-800 rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors placeholder-gray-500"
                        placeholder="Enter unique username"
                      />
                    </div>
                    {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>}
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserCheck className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        {...register('name', { required: 'Full name is required' })}
                        className="block w-full pl-10 pr-3 py-3 bg-dark-100 border border-gray-800 rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors placeholder-gray-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                        })}
                        className="block w-full pl-10 pr-3 py-3 bg-dark-100 border border-gray-800 rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors placeholder-gray-500"
                        placeholder="name@example.com"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="tel"
                        {...register('phone', { required: 'Phone number is required' })}
                        className="block w-full pl-10 pr-3 py-3 bg-dark-100 border border-gray-800 rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors placeholder-gray-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', {
                          required: 'Password is required',
                          minLength: { value: 8, message: 'Password must be at least 8 characters' }
                        })}
                        className="block w-full pl-10 pr-10 py-3 bg-dark-100 border border-gray-800 rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors placeholder-gray-500"
                        placeholder="Create password"
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

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('password_confirmation', {
                          required: 'Please confirm your password',
                          validate: value => value === password || 'Passwords do not match'
                        })}
                        className="block w-full pl-10 pr-10 py-3 bg-dark-100 border border-gray-800 rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors placeholder-gray-500"
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-primary transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password_confirmation && <p className="mt-1 text-sm text-red-400">{errors.password_confirmation.message}</p>}
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Country <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-500" />
                      </div>
                      <select
                        {...register('country', { required: 'Country is required' })}
                        className="block w-full pl-10 pr-10 py-3 bg-dark-100 border border-gray-800 rounded-lg shadow-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Select your country</option>
                        {countries.map(c => (
                          <option key={c.code} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                    {errors.country && <p className="mt-1 text-sm text-red-400">{errors.country.message}</p>}
                  </div>

                  {/* Referral ID (optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Referral ID (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        {...register('ref_by')}
                        className="block w-full pl-10 pr-3 py-3 bg-dark-100 border border-gray-800 rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors placeholder-gray-500"
                        placeholder="Enter referral ID if you have one"
                      />
                    </div>
                  </div>
                </div>

                {/* reCAPTCHA placeholder */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Captcha <span className="text-red-400">*</span>
                  </label>
                  <div className="g-recaptcha" data-sitekey="YOUR_SITE_KEY"></div>
                  <p className="text-xs text-gray-500 mt-1">reCAPTCHA integration – replace with actual widget</p>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    <span className="font-medium">Create Account</span>
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-400">
                    Already have an account?{' '}
                    <a href="/login" className="font-medium text-primary hover:text-primary-400 transition-colors">
                    Sign in
                    </a>
                </p>
                </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center text-xs text-gray-500">
              <Shield className="h-3 w-3 mr-1" />
              <span>Your information is secure – We respect your privacy</span>
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

export default Register;