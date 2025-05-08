import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import BuletinDetail from './pages/BuletinDetail'
import EditBuletin from './pages/EditBuletin'
import PublicFeed from './pages/PublicFeed';
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
import Step1_Welcome from './pages/Onboarding/Step1_Welcome'
import Step2_Profile from './pages/Onboarding/Step2_Profile'
import Step3_Topics from './pages/Onboarding/Step3_Topics'
import Step4_Preview from './pages/Onboarding/Step4_Preview'

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/buletin/:id" element={<BuletinDetail />} />
        <Route path="/edit/:id" element={<EditBuletin />} />
        <Route path="/buletin" element={<PublicFeed />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/create-buletins" element={<CreateBuletins />} />
        <Route path="/bookmarks" element={<BookmarkList />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-buletin" element={<CreateBuletinStep1 />} />
        <Route path="/create-buletin/step-2" element={<CreateBuletinStep2 />} />
        <Route path="/create-buletin/step-3" element={<CreateBuletinStep3 />} />
        <Route path="/profile/:userId" element={<UserPublicProfile />} />
        {/* Onboarding Steps */}
        <Route path="/onboarding/1" element={<Step1_Welcome />} />
        <Route path="/onboarding/2" element={<Step2_Profile />} />
        <Route path="/onboarding/3" element={<Step3_Topics />} />
        <Route path="/onboarding/4" element={<Step4_Preview />} />
        {/* Add more routes as needed */}

      </Routes>
    </BrowserRouter>
  )
}

export default Router
