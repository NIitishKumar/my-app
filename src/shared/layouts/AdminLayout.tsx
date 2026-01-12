import { Outlet, NavLink } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { ROUTES } from '../constants';
import { useUIStore, useAuthStore, selectIsSidebarOpen, selectUser } from '../../store';

const adminMenuItems = [
  { path: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: 'fa-home' },
  { path: ROUTES.ADMIN_CLASSES, label: 'Classes', icon: 'fa-desktop' },
  { path: ROUTES.ADMIN_TEACHERS, label: 'Teachers', icon: 'fa-user' },
  { path: ROUTES.ADMIN_STUDENTS, label: 'Students', icon: 'fa-user-graduate' },
  { path: ROUTES.ADMIN_LECTURES, label: 'Lectures', icon: 'fa-book' },
  { path: ROUTES.ADMIN_SUBJECTS, label: 'Subjects', icon: 'fa-book-open' },
  { path: ROUTES.ADMIN_NOTICES, label: 'Notices', icon: 'fa-bullhorn' },
];

const mobileBottomNav: Array<{ path: string; label: string; icon: string; badge?: number }> = [
  { path: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: 'fa-home' },
  { path: ROUTES.ADMIN_CLASSES, label: 'Classes', icon: 'fa-desktop' },
  { path: ROUTES.ADMIN_TEACHERS, label: 'Teachers', icon: 'fa-user' },
  { path: ROUTES.ADMIN_STUDENTS, label: 'Students', icon: 'fa-user-graduate' },
  { path: ROUTES.ADMIN_LECTURES, label: 'Lectures', icon: 'fa-book' },
];

export const AdminLayout = () => {
  // Zustand stores - using selectors for optimized re-renders
  const isSidebarOpen = useUIStore(selectIsSidebarOpen);
  const { openSidebar, closeSidebar } = useUIStore();
  const user = useAuthStore(selectUser);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop always visible, Mobile drawer */}
      <Sidebar items={adminMenuItems} isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Dashboard" 
          userName={user?.name} 
          onMenuClick={openSidebar}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50 pb-16 lg:pb-0">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation - Professional Design */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40">
          <div className="grid grid-cols-5 px-2 py-2">
            {mobileBottomNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
              >
                {({ isActive }) => (
                  <div className={`flex flex-col items-center justify-center py-2 mx-1 rounded-xl relative transition-all duration-200 ${
                    isActive 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-400'
                  }`}>
                    <i className={`fas ${item.icon} text-lg mb-0.5`}></i>
                    <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
                    {item.badge && (
                      <span className="absolute top-0.5 right-2 min-w-[14px] h-[14px] bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

