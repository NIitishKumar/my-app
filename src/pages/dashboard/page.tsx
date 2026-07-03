/* eslint-disable @typescript-eslint/no-explicit-any */
import { classesApi } from "../classes/api/classes.api";
import { quickActions } from "./index";
import { stats } from "./index.constant";
import { useDashboard } from "./index.hook";
import { useQuickStats } from "./useDashboardQueries";

export const AdminDashboard = () => {
  const {
    data: quickStats,
    isLoading: isLoadingQuick,
    error: quickError,
  } = useQuickStats();

  const {
    handleQuickActionClick,
    statsError,
    isLoadingStats,
    recentActivities,
    upcomingEvents,
  } = useDashboard();

  const isLoading = isLoadingQuick || isLoadingStats;

  const getData = async () => {
    const datasss = await classesApi.getAll();
    console.log({datasss})
}
  


  const hasError = quickError || statsError;

  if (hasError) {
    return (
      <div className="p-4 lg:p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <i className="fas fa-exclamation-circle text-red-600 text-3xl mb-3"></i>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-sm text-red-700">
            {quickError ? 'Failed to load quick statistics' : 'Failed to load dashboard data'}
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="p-4 lg:p-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
        {isLoading ? (
          <span>Loading...</span>
        ) : (
          quickStats && stats(quickStats)?.map((stat: any) => (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                >
                  <i
                    className={`fas ${stat.icon} ${stat.iconColor} text-xl`}
                  ></i>
                </div>

                <span
                  className={`flex items-center text-xs font-medium ${stat.changeColor} ${stat.changeBg} px-2 py-1 rounded-full`}
                >
                  {stat.change.includes("+") && (
                    <i className="fas fa-arrow-up text-xs mr-1"></i>
                  )}
                  {stat.change}
                </span>
              </div>

              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </h3>

              <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                {stat.value}
              </p>

              <p className="text-xs text-gray-500 mt-2">
                {stat.changeText}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Quick Actions
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action, i) => (
            <button
              key={action.title + i}
              onClick={() => handleQuickActionClick(action)}
              className={`flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-xl ${action.hoverColor} transition-all group cursor-pointer`}
            >
              <div
                className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center mb-2 ${action.groupHover} transition-colors`}
              >
                <i
                  className={`fas ${action.icon} ${action.iconColor} text-xl`}
                ></i>
              </div>

              <span className="text-sm font-medium text-gray-700">
                {action.title}
              </span>
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
              <h3 className="text-lg font-bold text-gray-900">
                Recent Activity
              </h3>

              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View All
              </button>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 animate-pulse"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>

                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-48 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              ))
            ) : recentActivities?.length ? (
              recentActivities.map((activity, i) => (
                <div
                  key={`${activity.title}-${activity.time}-${i}`}
                  className="flex items-start space-x-4"
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center`}
                  >
                    <i
                      className={`fas ${activity.icon} ${activity.iconColor}`}
                    ></i>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>

                    <p className="text-sm text-gray-600">
                      {activity.description}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No recent activity
              </p>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Upcoming Events
          </h3>

          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex space-x-3 animate-pulse">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>

                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-28"></div>
                  </div>
                </div>
              ))
            ) : upcomingEvents?.length ? (
              upcomingEvents.map((event, i) => (
                <div
                  key={`${event.title}-${event.date}-${i}`}
                  className="flex space-x-3"
                >
                  <div
                    className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${event.gradient} rounded-xl flex flex-col items-center justify-center text-white shadow-lg`}
                  >
                    <span className="text-xs font-medium">
                      {event.month}
                    </span>

                    <span className="text-xl font-bold">
                      {event.date}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {event.title}
                    </p>

                    <p className="text-xs text-gray-600 mt-1">
                      {event.time}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {event.location}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No upcoming events
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};