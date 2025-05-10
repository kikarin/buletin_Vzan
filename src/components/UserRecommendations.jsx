import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link } from 'react-router-dom';

function UserRecommendations({ userTopics }) {
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedUsers = async () => {
      try {
        const newUsersSnap = await getDocs(
          query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(5))
        );
        const newUsers = newUsersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const similarUsersSnap = await getDocs(
          query(collection(db, 'users'), where('topics', 'array-contains-any', userTopics), limit(5))
        );
        const similarUsers = similarUsersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const combined = [...newUsers, ...similarUsers];
        const unique = Array.from(new Map(combined.map(u => [u.id, u])).values());

        setRecommendedUsers(unique.slice(0, 5));
      } catch (err) {
        console.error('Gagal ambil rekomendasi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedUsers();
  }, [userTopics]);

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-md p-5 rounded-xl shadow border border-white/40">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Rekomendasi Pengguna</h3>
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
                <div className="w-1/2 h-2 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-md p-5 rounded-xl shadow border border-white/40">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Rekomendasi Pengguna</h3>
      <div className="space-y-3">
        {recommendedUsers.map((user) => {
          const isNew = user.createdAt?.toDate
            ? (Date.now() - user.createdAt.toDate().getTime()) / (1000 * 60 * 60 * 24) <= 3
            : false;

          return (
            <Link
              to={`/profile/${user.id}`}
              key={user.id}
              className="flex items-start gap-3 rounded-lg p-3 bg-white hover:bg-gray-50 transition border border-gray-100 group"
            >
              <img
                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}`}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-blue-100"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition">{user.name}</h4>
                  {isNew && (
                    <span className="text-[11px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full shadow-sm">
                      Baru
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{user.about || 'Belum ada deskripsi'}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default UserRecommendations;
