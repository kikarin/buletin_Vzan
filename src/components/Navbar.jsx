import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

function Navbar() {
  const navigate = useNavigate();
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

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow bg-white">
      <Link to="/home" className="text-xl font-bold text-blue-600">Buletin</Link>
      <div className="flex items-center space-x-4">
        <Link to="/home" className="text-gray-700 hover:text-blue-600">Reading</Link>
        <button
          onClick={handleWritingClick}
          className="text-gray-700 hover:text-blue-600"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Writing'}
        </button>

        {userData && (
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/profile')}
          >
            <img
              src={userData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'U')}`}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
