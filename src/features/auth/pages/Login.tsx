import { useState } from 'react';
import { useLogin } from '../hooks/useAuth';
import type { LoginCredentials } from '../models/auth.model';

export const Login = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: 'admin@school.com',
    password: 'admin123',
  });
  const [error, setError] = useState<string>('');

  const { mutate: login, isPending } = useLogin();

  // Quick login helper
  const quickLogin = (role: string) => {
    const emails = {
      admin: 'admin@school.com',
      teacher: 'teacher@school.com',
      student: 'student@school.com',
      parent: 'parent@school.com',
    };
    setCredentials({
      email: emails[role as keyof typeof emails],
      password: 'password123',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    login(credentials, {
      onError: (err) => {
        setError('Invalid credentials. Please try again.');
        console.error('Login error:', err);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            School Management System
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Quick Login Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => quickLogin('admin')}
            className="px-3 py-2 text-xs font-medium rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
          >
            👨‍💼 Login as Admin
          </button>
          <button
            type="button"
            onClick={() => quickLogin('teacher')}
            className="px-3 py-2 text-xs font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
          >
            👨‍🏫 Login as Teacher
          </button>
          <button
            type="button"
            onClick={() => quickLogin('student')}
            className="px-3 py-2 text-xs font-medium rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
          >
            👨‍🎓 Login as Student
          </button>
          <button
            type="button"
            onClick={() => quickLogin('parent')}
            className="px-3 py-2 text-xs font-medium rounded-md bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
          >
            👨‍👩‍👧 Login as Parent
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        {/* Test Credentials Info */}
        <div className="mt-4 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <p className="font-semibold text-sm text-gray-700 mb-2">🧪 Test Credentials:</p>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span className="font-medium">Admin:</span>
              <span>admin@school.com</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Teacher:</span>
              <span>teacher@school.com</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Student:</span>
              <span>student@school.com</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Parent:</span>
              <span>parent@school.com</span>
            </div>
            <div className="mt-2 pt-2 border-t border-blue-200 text-center text-gray-500">
              Password: <span className="font-medium">any value works</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

