// src/components/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Create Buletins', path: '/create-buletins' }, // ← Tambahan
    { label: 'Bookmarks', path: '/bookmarks' },
    { label: 'Notifications', path: '/notifications' },
    { label: 'Profile', path: '/profile' },
  ];
  

  return (
    <div className="w-64 bg-white border-r h-screen fixed top-0 left-0 p-6">
      <h2 className="text-xl font-bold text-blue-600 mb-8">Buletin</h2>
      <nav className="space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-2 rounded ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
