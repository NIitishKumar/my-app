/**
 * Documentation Section Component
 * Structured documentation content for Help & Support page
 */

export const DocumentationSection = () => {
  const documentationSections = [
    {
      title: 'Getting Started',
      icon: 'fa-rocket',
      items: [
        {
          heading: 'Account Setup',
          content: 'When you first log in, make sure to complete your profile by adding your personal information, contact details, and profile picture. This helps ensure accurate records and better communication.',
        },
        {
          heading: 'Navigation',
          content: 'Use the sidebar menu to navigate between different sections. On mobile devices, access the menu using the hamburger icon in the header. The bottom navigation bar provides quick access to key sections on mobile.',
        },
        {
          heading: 'Dashboard Overview',
          content: 'Your dashboard provides a quick overview of important information including attendance statistics, upcoming exams, recent notices, and quick actions.',
        },
      ],
    },
    {
      title: 'Attendance Management',
      icon: 'fa-clipboard-check',
      items: [
        {
          heading: 'Viewing Attendance',
          content: 'Navigate to the Attendance section to view your attendance records. You can see daily attendance, monthly summaries, and overall attendance percentage.',
        },
        {
          heading: 'Understanding Attendance Status',
          content: 'Attendance is marked as Present, Absent, or Late. Your attendance percentage is calculated based on the total number of classes and your presence.',
        },
        {
          heading: 'Reporting Issues',
          content: 'If you notice any discrepancies in your attendance records, use the Contact form to report the issue. Include the date and specific details.',
        },
      ],
    },
    {
      title: 'Academic Records',
      icon: 'fa-chart-line',
      items: [
        {
          heading: 'Viewing Grades',
          content: 'Access your academic records through the Academic Records section. Here you can view your grades, transcripts, and performance reports for all subjects.',
        },
        {
          heading: 'Understanding Your Grades',
          content: 'Grades are displayed by subject and exam type. You can view detailed breakdowns including individual exam scores and overall subject performance.',
        },
        {
          heading: 'Performance Tracking',
          content: 'Track your academic progress over time. The system provides visual charts and statistics to help you understand your performance trends.',
        },
      ],
    },
    {
      title: 'Profile Management',
      icon: 'fa-user',
      items: [
        {
          heading: 'Updating Profile',
          content: 'Go to your Profile page to update personal information, contact details, and profile picture. Keep your information up to date for better communication.',
        },
        {
          heading: 'Changing Password',
          content: 'Use the Change Password tab in your Profile to update your password. Ensure your new password meets security requirements (minimum 8 characters, includes uppercase, lowercase, number, and special character).',
        },
        {
          heading: 'Privacy Settings',
          content: 'Your profile information is secure and only accessible to authorized personnel. Contact support if you have privacy concerns.',
        },
      ],
    },
    {
      title: 'Communication',
      icon: 'fa-comments',
      items: [
        {
          heading: 'Notices and Announcements',
          content: 'Check the Notices section regularly for important announcements, updates, and information from the school administration.',
        },
        {
          heading: 'Contacting Teachers',
          content: 'Use the Queries section to submit questions or concerns to your teachers. Teachers will respond through the system, and you can track the status of your queries.',
        },
        {
          heading: 'Account Assistant',
          content: 'Use the Account Assistant chatbot (bottom-right corner) to quickly get information about your account details, profile, and role.',
        },
      ],
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Documentation</h2>
        <p className="text-gray-600">Comprehensive guides on how to use the platform features</p>
      </div>

      <div className="space-y-6">
        {documentationSections.map((section, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <i className={`fas ${section.icon} text-indigo-600`}></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
            </div>
            <div className="space-y-4 pl-13">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <h4 className="font-semibold text-gray-800 mb-2">{item.heading}</h4>
                  <p className="text-gray-600 leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

