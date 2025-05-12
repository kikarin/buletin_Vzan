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
import { toast } from 'react-hot-toast';
import { BarChart2, Globe, Lock } from 'lucide-react';
import DropdownPortal from '../components/DropdownPortal';

function Dashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [buletinProfiles, setBuletinProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [dropdownAnchor, setDropdownAnchor] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
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
    const confirmDelete = toast(
      (t) => (
        <span className="space-y-2">
          <p>Yakin ingin menghapus buletin ini?</p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await deleteDoc(doc(db, 'posts', id));
                setPosts(prev => prev.filter(p => p.id !== id));
                toast.success('Buletin berhasil dihapus');
              }}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm"
            >
              Hapus
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm"
            >
              Batal
            </button>
          </div>
        </span>
      ),
      {
        duration: 10000,
      }
    );
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
      <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-xl shadow-xl space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Postingan Buletin</h1>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-200/40 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-600 space-y-4">
            <p className="text-lg">Kamu belum membuat buletin post.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate('/create-buletins')}
                className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Buat Buletin
              </button>
              <button
                onClick={() => navigate('/create')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
              >
                Buat Post Baru
              </button>
            </div>
          </div>
        ) : (
          <ul className="space-y-4">
            {posts.map((p) => {
              const profile = buletinProfiles[p.buletinId] || {};
              return (
                <li
                  key={p.id}
                  className="border border-gray-200 rounded-xl p-5 flex justify-between items-start transition-all hover:shadow-xl hover:scale-[1.01] bg-white/70 backdrop-blur-md mb-10"
                >
                  <div className="flex gap-4 items-start">
                    {renderAvatar(p.buletinId)}
                    <div className="space-y-1">
                      <h2 className="text-lg font-semibold text-gray-800">{p.title}</h2>
                      <p className="text-sm text-gray-600">{p.subtitle || 'Tanpa subtitle'}</p>
                      <p className="text-xs text-gray-500">
                        Dibuat: {p.createdAt?.toDate?.().toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) || 'Tidak diketahui'}
                      </p>

                      <span className={`py-0.5 rounded-full text-xs font-semibold ${p.isPublic ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {p.isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>

                  {/* Dropdown Menu pakai Portal */}
                  <div className="relative">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (dropdownOpenId === p.id) {
                          setDropdownOpenId(null);
                          setDropdownAnchor(null);
                        } else {
                          setDropdownOpenId(p.id);
                          const rect = e.currentTarget.getBoundingClientRect();
                          setDropdownAnchor(e.currentTarget);
                          setDropdownPos({
                            top: rect.bottom + 6,
                            left: rect.left,
                          });
                        }
                      }}
                      className="text-gray-600 hover:text-gray-800 transition"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {/* DropdownPortal hanya render jika dropdownOpenId === p.id */}
                    {dropdownOpenId === p.id && dropdownAnchor && (
                      <DropdownPortal
                        top={dropdownPos.top}
                        left={dropdownPos.left}
                        onClose={() => {
                          setDropdownOpenId(null);
                          setDropdownAnchor(null);
                        }}
                      >
                        <div className="py-2 w-56">
                          <button
                            onClick={() => {
                              navigate(`/buletin/${p.id}`);
                              setDropdownOpenId(null);
                              setDropdownAnchor(null);
                            }}
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                          >
                            Lihat Post
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/buletin/${p.id}`);
                              toast.success('URL berhasil disalin!');
                              setDropdownOpenId(null);
                              setDropdownAnchor(null);
                            }}
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                          >
                            Salin URL
                          </button>
                          <button
                            onClick={() => {
                              toast.custom(() => (
                                <div className="bg-white px-4 py-2 rounded shadow border text-sm text-gray-800 flex items-center gap-3">
                                  <BarChart2 className="w-5 h-5 text-blue-600" />
                                  <span>Statistik belum tersedia.</span>
                                </div>
                              ));
                              setDropdownOpenId(null);
                              setDropdownAnchor(null);
                            }}
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                          >
                            Statistik
                          </button>
                          <button
                            onClick={() => {
                              navigate(`/edit/${p.id}`);
                              setDropdownOpenId(null);
                              setDropdownAnchor(null);
                            }}
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                          >
                            Edit Post
                          </button>
                          <button
                            onClick={() => {
                              togglePublish(p.id, p.isPublic);
                              setDropdownOpenId(null);
                              setDropdownAnchor(null);
                              toast.custom(() => (
                                <div className="bg-white px-4 py-2 rounded shadow border text-sm text-gray-800 flex items-center gap-3">
                                  {p.isPublic ? (
                                    <>
                                      <Lock className="w-5 h-5 text-yellow-600" />
                                      <span>Post berhasil disembunyikan (Private)</span>
                                    </>
                                  ) : (
                                    <>
                                      <Globe className="w-5 h-5 text-green-600" />
                                      <span>Post berhasil dipublikasikan (Public)</span>
                                    </>
                                  )}
                                </div>
                              ));
                            }}
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                          >
                            {p.isPublic ? 'Sembunyikan' : 'Publikasikan'}
                          </button>
                          <button
                            onClick={() => {
                              handleDelete(p.id);
                              setDropdownOpenId(null);
                              setDropdownAnchor(null);
                            }}
                            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                          >
                            Hapus
                          </button>
                        </div>
                      </DropdownPortal>
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
