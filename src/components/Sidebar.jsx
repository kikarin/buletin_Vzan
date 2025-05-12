import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  FilePlus,
  Bookmark,
  Bell,
  User,
  LayoutDashboard,
  Feather,
  Newspaper,
  X
} from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const menuItems = [
    { label: 'Postingan Saya', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Buletin Saya', path: '/my-bulletins', icon: <Newspaper className="w-5 h-5" /> },
    { label: 'Buat Buletin', path: '/create-buletins', icon: <FilePlus className="w-4 h-4" /> },
    { label: 'Post Buletin', path: '/create', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'disimpan', path: '/bookmarks', icon: <Bookmark className="w-4 h-4" /> },
    { label: 'Pemberitahuan', path: '/notifications', icon: <Bell className="w-4 h-4" /> },
    { label: 'Profil', path: '/profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <aside className="flex flex-col h-full md:h-screen w-full md:w-64 bg-white/70 backdrop-blur-md border-r border-gray-200 p-6 shadow-sm">
      {onClose && (
        <button
          onClick={onClose}
          className="mb-4 self-end text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-8 text-blue-600 font-bold text-lg">
        <Feather className="w-5 h-5" />
        <span className="tracking-tight">Vzan</span>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm font-medium
                ${isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
