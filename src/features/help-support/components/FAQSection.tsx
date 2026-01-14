/**
 * FAQ Section Component
 * Accordion-style FAQ items for Help & Support page
 */

import { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I view my attendance records?',
    answer: 'You can view your attendance records by navigating to the Attendance section in the main menu. Here you will see your attendance history, percentage, and detailed breakdown by date.',
    category: 'attendance',
  },
  {
    id: '2',
    question: 'How can I update my profile information?',
    answer: 'To update your profile, go to the Profile section from the main menu or click on your profile icon in the header. You can edit your personal information, contact details, and profile picture.',
    category: 'profile',
  },
  {
    id: '3',
    question: 'Where can I find my exam schedule?',
    answer: 'Your exam schedule is available in the Exams section. You can view upcoming exams, dates, times, and subjects. Make sure to check regularly for any updates.',
    category: 'exams',
  },
  {
    id: '4',
    question: 'How do I view my academic records?',
    answer: 'Navigate to the Academic Records section from the main menu. Here you can view your grades, transcripts, and performance reports for all subjects.',
    category: 'records',
  },
  {
    id: '5',
    question: 'What should I do if I notice an error in my attendance?',
    answer: 'If you notice any discrepancies in your attendance records, please contact your class teacher or use the Contact form in Help & Support to report the issue. Include the date and details of the discrepancy.',
    category: 'attendance',
  },
  {
    id: '6',
    question: 'How can I change my password?',
    answer: 'Go to your Profile page and click on the "Change Password" tab. Enter your current password and your new password. Make sure your new password meets the security requirements.',
    category: 'account',
  },
  {
    id: '7',
    question: 'Where can I see notices and announcements?',
    answer: 'All notices and announcements are displayed in the Notices section. Important notices will also appear on your dashboard. Make sure to check regularly for updates.',
    category: 'notices',
  },
  {
    id: '8',
    question: 'How do I contact my teachers?',
    answer: 'You can contact your teachers through the Queries section. Submit a query with your question or concern, and your teacher will respond through the system.',
    category: 'communication',
  },
  {
    id: '9',
    question: 'Can I view my child\'s attendance as a parent?',
    answer: 'Yes, as a parent you have access to view your child\'s attendance records, academic performance, and other relevant information through the Parent Dashboard and respective sections.',
    category: 'parent',
  },
  {
    id: '10',
    question: 'What information can I see in my dashboard?',
    answer: 'Your dashboard provides an overview of your key information including attendance statistics, upcoming exams, recent notices, and quick access to important sections of the application.',
    category: 'dashboard',
  },
];

export const FAQSection = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
        <p className="text-gray-600">Find answers to common questions about using the platform</p>
      </div>

      <div className="space-y-3">
        {faqData.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
              aria-expanded={openItems.has(item.id)}
            >
              <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
              <i
                className={`fas ${
                  openItems.has(item.id) ? 'fa-chevron-up' : 'fa-chevron-down'
                } text-indigo-600 flex-shrink-0`}
              ></i>
            </button>
            {openItems.has(item.id) && (
              <div className="px-6 pb-4 pt-0">
                <p className="text-gray-700 leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

