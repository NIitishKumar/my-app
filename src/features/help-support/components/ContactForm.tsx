/**
 * Contact Form Component
 * Form for submitting support requests
 */

import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuthStore, selectUser } from '../../../store';
import toast from 'react-hot-toast';

interface ContactFormData {
  subject: string;
  category: string;
  message: string;
  email?: string;
}

const validationSchema = yup.object({
  subject: yup.string().required('Subject is required').min(5, 'Subject must be at least 5 characters'),
  category: yup.string().required('Please select a category'),
  message: yup
    .string()
    .required('Message is required')
    .min(20, 'Message must be at least 20 characters')
    .max(1000, 'Message must not exceed 1000 characters'),
});

const categoryOptions = [
  { value: 'account', label: 'Account Issues' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'attendance', label: 'Attendance' },
  { value: 'grades', label: 'Grades & Records' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'other', label: 'Other' },
];

export const ContactForm = () => {
  const user = useAuthStore(selectUser);

  const formik = useFormik<ContactFormData>({
    initialValues: {
      subject: '',
      category: '',
      message: '',
      email: user?.email || '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // TODO: Replace with actual API call when backend is ready
        console.log('Contact form submission:', values);
        
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        toast.success('Your message has been submitted successfully! We will get back to you soon.');
        resetForm();
      } catch (error) {
        toast.error('Failed to submit your message. Please try again.');
      }
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Support</h2>
        <p className="text-gray-600">Have a question or need assistance? Send us a message and we'll get back to you.</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Email (auto-filled, read-only) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                formik.touched.category && formik.errors.category
                  ? 'border-red-300'
                  : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formik.touched.category && formik.errors.category && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.category}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formik.values.subject}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Brief description of your issue"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                formik.touched.subject && formik.errors.subject
                  ? 'border-red-300'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.subject && formik.errors.subject && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.subject}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={6}
              placeholder="Please provide details about your question or issue..."
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                formik.touched.message && formik.errors.message
                  ? 'border-red-300'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.message && formik.errors.message && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formik.values.message.length}/1000 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {formik.isSubmitting ? (
                <span className="flex items-center gap-2">
                  <i className="fas fa-spinner fa-spin"></i>
                  Submitting...
                </span>
              ) : (
                'Submit Message'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

