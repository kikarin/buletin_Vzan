import { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState({
    name: '',
    avatarUrl: '',
    about: '',
    socialUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);


  // Ambil data profil dari Firestore
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setProfile(data);
        setEditProfile({
          name: data.name || '',
          avatarUrl: data.avatarUrl || '',
          about: data.about || '',
          socialUrl: data.socialUrl || '',
        });
      }

      setLoading(false);
    };

    fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!userId) return;
  
      const postSnapshot = await getDocs(
        query(collection(db, 'posts'), where('userId', '==', userId))
      );
  
      let totalLikes = 0;
      postSnapshot.forEach(doc => {
        const data = doc.data();
        totalLikes += data.likes?.length || 0;
      });
  
      let totalComments = 0;
      const allPosts = await getDocs(collection(db, 'posts'));
      for (const post of allPosts.docs) {
        const commentsCol = collection(doc(db, 'posts', post.id), 'comments');
        const commentsSnap = await getDocs(commentsCol);
        totalComments += commentsSnap.docs.filter(c => c.data().userId === userId).length;
      }
  
      const subSnap = await getDocs(collection(db, 'users', userId, 'subscribers'));
      const totalSubscribers = subSnap.size;
  
      setLikeCount(totalLikes);
      setCommentCount(totalComments);
      setSubscriberCount(totalSubscribers);
    };
  
    fetchStats();
  }, [userId]);
    
  
  const handleSaveProfile = async () => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        name: editProfile.name,
        avatarUrl: editProfile.avatarUrl,
        about: editProfile.about,
        socialUrl: editProfile.socialUrl,
      });
      alert('Profil diperbarui!');
      setProfile({ ...profile, ...editProfile });
    } catch (err) {
      console.error('Gagal memperbarui profil:', err);
    }
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        localStorage.clear();
        navigate('/login');
      })
      .catch((err) => {
        console.error('Gagal logout:', err);
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h1 className="text-xl font-bold mb-4">👤 Profil Pengguna</h1>

      {loading ? (
        <p>Memuat profil...</p>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-4">
            {editProfile.avatarUrl && (
              <img
                src={editProfile.avatarUrl}
                alt="Avatar"
                className="w-16 h-16 rounded-full"
              />
            )}
            <input
              className="border p-2 w-full"
              placeholder="URL Avatar"
              value={editProfile.avatarUrl}
              onChange={(e) =>
                setEditProfile({ ...editProfile, avatarUrl: e.target.value })
              }
            />
          </div>

          <input
            className="border p-2 w-full mb-2"
            placeholder="Nama"
            value={editProfile.name}
            onChange={(e) =>
              setEditProfile({ ...editProfile, name: e.target.value })
            }
          />

          <textarea
            className="border p-2 w-full mb-2"
            placeholder="Tentang kamu"
            value={editProfile.about}
            onChange={(e) =>
              setEditProfile({ ...editProfile, about: e.target.value })
            }
          />

          <input
            className="border p-2 w-full mb-4"
            placeholder="URL Sosial Media"
            value={editProfile.socialUrl}
            onChange={(e) =>
              setEditProfile({ ...editProfile, socialUrl: e.target.value })
            }
          />

          <button
            onClick={handleSaveProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Simpan Profil
          </button>

          <div className="mt-6">
            <h2 className="font-semibold mb-2">📊 Statistik</h2>
            <p>❤️ Total Like Diterima: {likeCount}</p>
              <p>💬 Total Komentar Dibuat: {commentCount}</p>
              <p>👥 Total Subscriber: {subscriberCount}</p>


            {profile?.topics?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-1">Topik Favorit:</h3>
                <ul className="list-disc ml-5 text-sm text-gray-700">
                  {profile.topics.map((topic, idx) => (
                    <li key={idx}>{topic}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default UserProfile;
