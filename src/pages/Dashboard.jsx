import { useEffect, useState, useRef } from 'react';
import { db, auth } from '../services/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { MoreVertical } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [buletinProfiles, setBuletinProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        // 1. Ambil semua buletins milik user
        const buletinsSnapshot = await getDocs(
          query(collection(db, 'buletins'), where('userId', '==', user.uid))
        );
        const buletins = [];
        const buletinProfilesMap = {};
        buletinsSnapshot.forEach(doc => {
          buletins.push(doc.id);
          buletinProfilesMap[doc.id] = doc.data();
        });
        setBuletinProfiles(buletinProfilesMap);

        // 2. Ambil semua buletin (post) berdasarkan buletins.id (parent relationship)
        const allPosts = [];
        for (const buletinId of buletins) {
          const postsSnapshot = await getDocs(
            query(collection(db, 'posts'), where('buletinId', '==', buletinId))
          );
          postsSnapshot.forEach(doc => {
            allPosts.push({
              id: doc.id,
              ...doc.data()
            });
          });
        }

        setPosts(allPosts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);



  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus buletin ini?')) {
      await deleteDoc(doc(db, 'posts', id));
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  const togglePublish = async (id, isPublic) => {
    await updateDoc(doc(db, 'posts', id), { isPublic: !isPublic });
    setPosts(prev =>
      prev.map(p => p.id === id ? { ...p, isPublic: !isPublic } : p)
    );
  };

  const renderAvatar = (buletinId) => {
    const profile = buletinProfiles[buletinId];
    if (!profile) return null;
  
    if (profile.profileImageUrl) {
      return (
        <img
          src={profile.profileImageUrl}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }
  
    const initials = (profile.name || '').slice(0, 2).toUpperCase() || 'BN';
    return (
      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
        {initials}
      </div>
    );
  };
  

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">📋 Dashboard Buletin</h1>

        {loading ? (
          <p>Loading...</p>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-600">
            <p className="mb-4">Kamu belum membuat buletin post.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate('/create-buletins')}
                className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
              >
                Create Buletin
              </button>
              <button
                onClick={() => navigate('/create')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Create New Post
              </button>
            </div>
          </div>
        ) : (
          <ul className="space-y-4">
            {posts.map(p => {
              const profile = buletinProfiles[p.buletinId] || {};
              return (
                <li key={p.id} className="border p-4 rounded flex justify-between items-start">
                  <div className="flex gap-3 items-start">
                    {renderAvatar(p.buletinId)}
                    <div>
                      <h2 className="font-semibold text-lg">{p.title}</h2>
                      <p className="text-sm text-gray-500">{p.subtitle || 'Tanpa subtitle'}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Dibuat pada: {p.createdAt?.toDate?.().toLocaleDateString('id-ID') || 'Tidak diketahui'}
                      </p>
                      <p className="text-sm text-gray-400">
                        Buletin: {profile.name || 'Tanpa nama buletin'} | Status: {p.isPublic ? '🌐 Public' : '🔒 Private'}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <button onClick={() =>
                      setDropdownOpenId(dropdownOpenId === p.id ? null : p.id)
                    }>
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {dropdownOpenId === p.id && (
                      <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow z-10">
                        <button
                          onClick={() => {
                            navigate(`/buletin/${p.id}`);
                            setDropdownOpenId(null); // Tutup dropdown
                          }}
                          className="block px-4 py-2 text-left w-full hover:bg-gray-100"
                        >👁️ View Post</button>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/buletin/${p.id}`);
                            alert("URL disalin!");
                            setDropdownOpenId(null);
                          }}
                          className="block px-4 py-2 text-left w-full hover:bg-gray-100"
                        >🔗 Share</button>

                        <button
                          onClick={() => {
                            alert("📊 Statistik belum tersedia");
                            setDropdownOpenId(null);
                          }}
                          className="block px-4 py-2 text-left w-full hover:bg-gray-100"
                        >📊 Stats</button>

                        <button
                          onClick={() => {
                            navigate(`/edit/${p.id}`);
                            setDropdownOpenId(null);
                          }}
                          className="block px-4 py-2 text-left w-full hover:bg-gray-100"
                        >✏️ Edit</button>

                        <button
                          onClick={() => {
                            togglePublish(p.id, p.isPublic);
                            setDropdownOpenId(null);
                          }}
                          className="block px-4 py-2 text-left w-full hover:bg-gray-100"
                        >
                          {p.isPublic ? '🔒 Unpublish' : '🚀 Publish'}
                        </button>

                        <button
                          onClick={() => {
                            handleDelete(p.id);
                            setDropdownOpenId(null);
                          }}
                          className="block px-4 py-2 text-left w-full text-red-600 hover:bg-red-50"
                        >🗑️ Delete</button>
                      </div>
                    )}
                  </div>

                </li>
              );
            })}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
