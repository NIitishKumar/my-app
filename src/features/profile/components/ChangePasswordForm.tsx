/**
 * ChangePasswordForm Component
 * Shared component for changing user password (used by all roles)
 */

import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useChangePassword } from '../hooks/useChangePassword';
import { Button } from '../../../shared/components/Button';

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const validationSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Calculate password strength
 */
const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 3) return { score, label: 'Fair', color: 'bg-yellow-500' };
  if (score <= 4) return { score, label: 'Good', color: 'bg-blue-500' };
  return { score, label: 'Strong', color: 'bg-green-500' };
};

export const ChangePasswordForm = ({ onSuccess, onCancel }: ChangePasswordFormProps) => {
  const changePassword = useChangePassword();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await changePassword.mutateAsync({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        });
        resetForm();
        onSuccess?.();
      } catch (error) {
        // Error is handled by the hook (toast notification)
      }
    },
  });

  const passwordStrength = formik.values.newPassword
    ? getPasswordStrength(formik.values.newPassword)
    : null;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <p className="text-sm text-gray-600 mb-6">
          Please enter your current password and choose a new password.
        </p>
      </div>

      {/* Current Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPasswords.current ? 'text' : 'password'}
            name="currentPassword"
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
              formik.touched.currentPassword && formik.errors.currentPassword
                ? 'border-red-500 bg-red-50 focus:ring-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            <i className={`fas ${showPasswords.current ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
        </div>
        {formik.touched.currentPassword && formik.errors.currentPassword && (
          <p className="mt-1 text-xs text-red-600">{formik.errors.currentPassword}</p>
        )}
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          New Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPasswords.new ? 'text' : 'password'}
            name="newPassword"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
              formik.touched.newPassword && formik.errors.newPassword
                ? 'border-red-500 bg-red-50 focus:ring-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            <i className={`fas ${showPasswords.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
        </div>
        {formik.touched.newPassword && formik.errors.newPassword && (
          <p className="mt-1 text-xs text-red-600">{formik.errors.newPassword}</p>
        )}
        
        {/* Password Strength Indicator */}
        {formik.values.newPassword && passwordStrength && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Password strength:</span>
              <span className={`text-xs font-medium ${passwordStrength.color.replace('bg-', 'text-')}`}>
                {passwordStrength.label}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${passwordStrength.color}`}
                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Password Requirements */}
        {formik.values.newPassword && (
          <div className="mt-2 text-xs text-gray-600">
            <p className="font-medium mb-1">Password requirements:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li className={formik.values.newPassword.length >= 8 ? 'text-green-600' : ''}>
                At least 8 characters
              </li>
              <li className={/[A-Z]/.test(formik.values.newPassword) ? 'text-green-600' : ''}>
                One uppercase letter
              </li>
              <li className={/[a-z]/.test(formik.values.newPassword) ? 'text-green-600' : ''}>
                One lowercase letter
              </li>
              <li className={/[0-9]/.test(formik.values.newPassword) ? 'text-green-600' : ''}>
                One number
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm New Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPasswords.confirm ? 'text' : 'password'}
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? 'border-red-500 bg-red-50 focus:ring-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            <i className={`fas ${showPasswords.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
        </div>
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-600">{formik.errors.confirmPassword}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={changePassword.isPending}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          isLoading={changePassword.isPending}
          loadingText="Changing..."
          disabled={!formik.isValid}
        >
          Change Password
        </Button>
      </div>
    </form>
  );
};

