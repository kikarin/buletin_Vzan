import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

function Navbar() {
  const navigate = useNavigate();
  // Removed duplicate declaration of isHome
  const isWriting = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/create-buletin');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const userId = localStorage.getItem('userId');


  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };
    fetchUserData();
  }, [userId]);

  const handleWritingClick = async () => {
    if (!userId) {
      navigate('/login');
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'buletins'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const hasBuletins = snapshot.size > 0;

    navigate(hasBuletins ? '/dashboard' : '/create-buletin');
    setLoading(false);
  };

  const isHome = location.pathname === '/home';

  return (
    <nav className="sticky top-0 z-50 bg-white/30 backdrop-blur-md border-b border-white/40 shadow-sm px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/home" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text tracking-tight">
          BuletinVzan
        </Link>

        {/* Center Nav Links */}
        <div className="flex gap-2 items-center bg-white/60 px-3 py-1 rounded-full shadow-sm border border-white/30">
          <Link
            to="/home"
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm transition ${isHome
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-blue-50'
              }`}
          >
            <svg className={`w-4 h-4 ${isHome ? 'text-white' : 'text-blue-600'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h9" />
            </svg>
            Reading
          </Link>
          <button
  onClick={handleWritingClick}
  disabled={loading}
  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm transition ${
    isWriting
      ? 'bg-purple-600 text-white'
      : 'text-gray-700 hover:bg-purple-50'
  } disabled:opacity-40`}
>
  <svg className={`w-4 h-4 ${isWriting ? 'text-white' : 'text-purple-600'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5l4 4M4 13v7h7L20.5 10.5l-7-7L4 13z" />
  </svg>
  {loading ? 'Loading...' : 'Writing'}
</button>

        </div>

        {/* Avatar */}
        {userData && (
          <div
            className="cursor-pointer rounded-full overflow-hidden border-2 border-blue-200 hover:scale-105 transition"
            onClick={() => navigate('/profile')}
          >
            <img
              src={
                userData.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'U')}`
              }
              alt="avatar"
              className="w-9 h-9 object-cover"
            />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
