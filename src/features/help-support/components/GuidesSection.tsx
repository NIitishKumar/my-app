/**
 * Guides Section Component
 * Step-by-step guides for common tasks
 */

export const GuidesSection = () => {
  const guides = [
    {
      title: 'How to Check Your Attendance',
      icon: 'fa-clipboard-check',
      steps: [
        'Navigate to the Attendance section from the main menu',
        'View your attendance summary showing overall percentage',
        'Click on any date to see detailed attendance records',
        'Use filters to view attendance by month or subject',
      ],
    },
    {
      title: 'How to Update Your Profile',
      icon: 'fa-user-edit',
      steps: [
        'Go to your Profile page from the main menu or header',
        'Click the "Edit Profile" button',
        'Update your personal information, contact details, or other fields',
        'Click "Save Changes" to update your profile',
        'Upload a new profile picture if needed',
      ],
    },
    {
      title: 'How to View Your Exam Schedule',
      icon: 'fa-calendar-alt',
      steps: [
        'Navigate to the Exams section from the main menu',
        'View your upcoming exams with dates and times',
        'Check exam details including subject, duration, and venue',
        'Set reminders for important exam dates',
      ],
    },
    {
      title: 'How to Submit a Query to Your Teacher',
      icon: 'fa-question-circle',
      steps: [
        'Go to the Queries section from the main menu',
        'Click "New Query" or "Raise Query" button',
        'Select the subject or teacher (if applicable)',
        'Enter your question or concern',
        'Submit the query and wait for a response',
        'Track the status of your query in the Queries section',
      ],
    },
    {
      title: 'How to Change Your Password',
      icon: 'fa-key',
      steps: [
        'Navigate to your Profile page',
        'Click on the "Change Password" tab',
        'Enter your current password',
        'Enter your new password (must meet security requirements)',
        'Confirm your new password',
        'Click "Change Password" to save',
      ],
    },
    {
      title: 'How to View Academic Records',
      icon: 'fa-graduation-cap',
      steps: [
        'Go to the Academic Records section from the main menu',
        'View your overall academic performance',
        'Select a subject to see detailed grades',
        'View transcripts and performance reports',
        'Export or print your records if needed',
      ],
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step-by-Step Guides</h2>
        <p className="text-gray-600">Follow these guides to complete common tasks on the platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className={`fas ${guide.icon} text-indigo-600`}></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{guide.title}</h3>
            </div>
            <ol className="space-y-3 pl-13">
              {guide.steps.map((step, stepIndex) => (
                <li key={stepIndex} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    {stepIndex + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
};

