import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import BuletinDetail from './pages/BuletinDetail';
import EditBuletin from './pages/EditBuletin';
import CreatePost from './pages/CreatePost';
import CreateBuletins from './pages/CreateBuletins';
import BookmarkList from './pages/BookmarkList';
import NotificationPage from './pages/NotificationPage';
import UserProfile from './pages/UserProfile';
import UserPublicProfile from './pages/UserPublicProfile';
import Dashboard from './pages/Dashboard';
import CreateBuletinStep1 from './pages/CreateBuletinStep1';
import CreateBuletinStep2 from './pages/CreateBuletinStep2';
import CreateBuletinStep3 from './pages/CreateBuletinStep3';
import Step1_Welcome from './pages/Onboarding/Step1_Welcome';
import Step2_Profile from './pages/Onboarding/Step2_Profile';
import Step3_Topics from './pages/Onboarding/Step3_Topics';
import Step4_Preview from './pages/Onboarding/Step4_Preview';
import ProtectedRoute from './components/ProtectedRoute';
import MyBulletins from './pages/MyBulletins';
import EditBuletins from './pages/EditBuletins';

function Router() {
  return (
    <BrowserRouter>
      {/* ✅ Toast notification provider di sini */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/buletin/:id" element={<ProtectedRoute><BuletinDetail /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditBuletin /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/create-buletins" element={<ProtectedRoute><CreateBuletins /></ProtectedRoute>} />
        <Route path="/bookmarks" element={<ProtectedRoute><BookmarkList /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-buletin" element={<ProtectedRoute><CreateBuletinStep1 /></ProtectedRoute>} />
        <Route path="/create-buletin/step-2" element={<ProtectedRoute><CreateBuletinStep2 /></ProtectedRoute>} />
        <Route path="/create-buletin/step-3" element={<ProtectedRoute><CreateBuletinStep3 /></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><UserPublicProfile /></ProtectedRoute>} />
        <Route path="/my-bulletins" element={<ProtectedRoute><MyBulletins /></ProtectedRoute>} />
        <Route path="/edit-bulletin/:id" element={<EditBuletins />} />

        {/* Onboarding routes */}
        <Route path="/onboarding/1" element={<ProtectedRoute><Step1_Welcome /></ProtectedRoute>} />
        <Route path="/onboarding/2" element={<ProtectedRoute><Step2_Profile /></ProtectedRoute>} />
        <Route path="/onboarding/3" element={<ProtectedRoute><Step3_Topics /></ProtectedRoute>} />
        <Route path="/onboarding/4" element={<ProtectedRoute><Step4_Preview /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
