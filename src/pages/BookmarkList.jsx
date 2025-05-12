import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Bookmark, Inbox } from 'lucide-react';


function BookmarkList() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!userId) return;
      try {
        const bookmarkCol = collection(db, 'users', userId, 'bookmarks');
        const snapshot = await getDocs(bookmarkCol);
        const bookmarkData = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const buletinId = docSnap.id;
            const buletinRef = doc(db, 'posts', buletinId);
            const buletinSnap = await getDoc(buletinRef);
            return buletinSnap.exists()
              ? { id: buletinId, ...buletinSnap.data() }
              : null;
          })
        );
        setBookmarks(bookmarkData.filter(Boolean));
      } catch (err) {
        console.error('Gagal mengambil bookmark:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [userId]);

  return (
    <DashboardLayout>
      <div className="w-full px-4 md:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Bookmark className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-600">Bookmark Saya</h1>
        </div>

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-sm text-gray-500 mt-10">Memuat bookmark...</p>
        ) : bookmarks.length === 0 ? (
          <div className="text-center text-gray-600 mt-10 space-y-2">
            <Inbox className="mx-auto w-8 h-8 text-gray-400" />
            <p className="text-lg font-medium">Belum ada buletin yang kamu simpan.</p>
            <p className="text-sm text-gray-500">Kamu bisa bookmark buletin dari halaman post.</p>
          </div>

        ) : (
          <ul className="space-y-4">
            {bookmarks.map((b) => {
              const tanggal = b.createdAt?.toDate?.().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              });
              return (
                <li
                  key={b.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-md hover:shadow-lg transition-all group"
                >
                  <img
                    src={
                      b.buletinProfileImage ||
                      b.profileImageUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(b.buletinName || 'B')}`
                    }
                    alt={b.buletinName}
                    className="w-12 h-12 rounded-full object-cover border border-blue-200"
                  />

                  <div className="flex-1 space-y-1">
                    <Link
                      to={`/buletin/${b.id}`}
                      className="text-lg font-semibold text-blue-600 group-hover:underline"
                    >
                      {b.buletinName}
                    </Link>
                    {tanggal && (
                      <p className="text-xs text-gray-400">• {tanggal}</p>
                    )}


                    <p className="text-sm text-gray-600 leading-snug">
                      {b.content
                        ? b.content
                          .replace(/<[^>]+>/g, '')
                          .replace(/&nbsp;/g, ' ')
                          .replace(/\s+/g, ' ')
                          .trim()
                          .slice(0, 140) + '...'
                        : 'Tidak ada konten'}
                    </p>

                    {b.category && (
                      <span className="inline-block text-xs mt-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {b.category}
                      </span>
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

export default BookmarkList;
