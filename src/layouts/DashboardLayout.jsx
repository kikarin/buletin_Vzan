// src/layouts/DashboardLayout.jsx
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 min-h-screen">
        <Navbar /> {/* Tambahkan ini */}
        <main className="p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
