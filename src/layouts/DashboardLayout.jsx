import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import { Menu } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-800 relative">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Bottom Navigation Panel */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 rounded-t-2xl p-6 shadow-xl transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-y-0' : 'translate-y-full'} md:hidden`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Layout */}
      <div className="flex">
        {/* Sidebar Desktop */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-4 md:p-8 relative">
            {children}

            {/* FAB Toggle Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="fixed bottom-6 right-6 z-50 md:hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
