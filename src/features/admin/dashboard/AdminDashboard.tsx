export const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '2,847',
      change: '+12%',
      changeText: '+342 from last month',
      icon: 'fa-user-graduate',
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      changeColor: 'text-green-600',
      changeBg: 'bg-green-50',
    },
    {
      title: 'Total Teachers',
      value: '187',
      change: '+5%',
      changeText: '+9 from last month',
      icon: 'fa-chalkboard-teacher',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      changeColor: 'text-green-600',
      changeBg: 'bg-green-50',
    },
    {
      title: 'Total Classes',
      value: '48',
      change: 'Active',
      changeText: 'Across 12 grades',
      icon: 'fa-chalkboard',
      bgColor: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      changeColor: 'text-blue-600',
      changeBg: 'bg-blue-50',
    },
    {
      title: 'Attendance Rate',
      value: '94.2%',
      change: '+2%',
      changeText: 'This month average',
      icon: 'fa-clipboard-check',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      changeColor: 'text-green-600',
      changeBg: 'bg-green-50',
    },
  ];

  const quickActions = [
    { title: 'Add Class', icon: 'fa-chalkboard', bgColor: 'bg-indigo-100', hoverColor: 'hover:border-indigo-300 hover:bg-indigo-50', iconColor: 'text-indigo-600', groupHover: 'group-hover:bg-indigo-200' },
    { title: 'Add Teacher', icon: 'fa-user-plus', bgColor: 'bg-purple-100', hoverColor: 'hover:border-purple-300 hover:bg-purple-50', iconColor: 'text-purple-600', groupHover: 'group-hover:bg-purple-200' },
    { title: 'Create Notice', icon: 'fa-bullhorn', bgColor: 'bg-cyan-100', hoverColor: 'hover:border-cyan-300 hover:bg-cyan-50', iconColor: 'text-cyan-600', groupHover: 'group-hover:bg-cyan-200' },
    { title: 'Schedule Exam', icon: 'fa-calendar-plus', bgColor: 'bg-green-100', hoverColor: 'hover:border-green-300 hover:bg-green-50', iconColor: 'text-green-600', groupHover: 'group-hover:bg-green-200' },
    { title: 'Generate Report', icon: 'fa-file-invoice', bgColor: 'bg-orange-100', hoverColor: 'hover:border-orange-300 hover:bg-orange-50', iconColor: 'text-orange-600', groupHover: 'group-hover:bg-orange-200' },
    { title: 'Settings', icon: 'fa-cog', bgColor: 'bg-red-100', hoverColor: 'hover:border-red-300 hover:bg-red-50', iconColor: 'text-red-600', groupHover: 'group-hover:bg-red-200' },
  ];

  const recentActivities = [
    {
      title: 'New student enrolled',
      description: 'Emma Wilson joined Grade 10-A',
      time: '2 hours ago',
      icon: 'fa-user-plus',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Exam scheduled',
      description: 'Mid-term exams for Grade 11 on March 25',
      time: '5 hours ago',
      icon: 'fa-calendar',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Notice published',
      description: 'Parent-teacher meeting on March 18',
      time: '1 day ago',
      icon: 'fa-bullhorn',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Attendance marked',
      description: 'Grade 9-B attendance completed by Mr. Johnson',
      time: '1 day ago',
      icon: 'fa-clipboard-check',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Low attendance alert',
      description: 'Grade 12-C attendance below 85%',
      time: '2 days ago',
      icon: 'fa-exclamation-triangle',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
    },
  ];

  const upcomingEvents = [
    {
      date: '15',
      month: 'MAR',
      title: 'Parent-Teacher Meeting',
      time: '10:00 AM - 2:00 PM',
      location: 'Main Auditorium',
      gradient: 'from-indigo-500 to-indigo-600',
    },
    {
      date: '18',
      month: 'MAR',
      title: 'Science Fair',
      time: '9:00 AM - 5:00 PM',
      location: 'Science Block',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      date: '22',
      month: 'MAR',
      title: 'Sports Day',
      time: '8:00 AM - 4:00 PM',
      location: 'Sports Ground',
      gradient: 'from-green-500 to-green-600',
    },
    {
      date: '25',
      month: 'MAR',
      title: 'Mid-Term Exams Begin',
      time: 'All Grades',
      location: 'Exam Halls',
      gradient: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="p-4 lg:p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <i className={`fas ${stat.icon} ${stat.iconColor} text-xl`}></i>
              </div>
              <span className={`flex items-center text-xs font-medium ${stat.changeColor} ${stat.changeBg} px-2 py-1 rounded-full`}>
                {stat.change.includes('+') && <i className="fas fa-arrow-up text-xs mr-1"></i>}
                {stat.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-2">{stat.changeText}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className={`flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-xl ${action.hoverColor} transition-all group`}
            >
              <div className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center mb-2 ${action.groupHover} transition-colors`}>
                <i className={`fas ${action.icon} ${action.iconColor} text-xl`}></i>
              </div>
              <span className="text-sm font-medium text-gray-700">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center`}>
                  <i className={`fas ${activity.icon} ${activity.iconColor}`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex space-x-3">
                <div className={`flex-shrink-0 w-14 h-14 bg-linear-to-br ${event.gradient} rounded-xl flex flex-col items-center justify-center text-white shadow-lg`}>
                  <span className="text-xs font-medium">{event.month}</span>
                  <span className="text-xl font-bold">{event.date}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{event.time}</p>
                  <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

