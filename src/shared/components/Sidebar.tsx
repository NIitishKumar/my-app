import { NavLink } from 'react-router-dom';

interface SidebarItem {
  path: string;
  label: string;
  icon?: string;
}

interface SidebarProps {
  items: SidebarItem[];
}

export const Sidebar = ({ items }: SidebarProps) => {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

