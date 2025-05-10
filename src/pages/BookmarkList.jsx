// src/pages/BookmarkList.jsx
import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link } from 'react-router-dom';

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

  if (loading) return <p className="text-center mt-10">Memuat bookmark...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">📌 Daftar Bookmark</h1>
      {bookmarks.length === 0 ? (
        <p>Kamu belum membookmark buletin apa pun.</p>
      ) : (
        <ul className="space-y-4">
          {bookmarks.map((b) => (
            <li key={b.id} className="border rounded p-4 hover:shadow flex items-center gap-4">
              <img
                src={b.buletinProfileImage || b.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(b.buletinName || 'B')}`}
                alt={b.buletinName}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div className="flex-1">
                <Link to={`/buletin/${b.id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                  {b.buletinName}
                </Link>
                <p className="text-sm text-gray-600 mt-1">
                  {b.content
                    ? b.content
                        .replace(/<[^>]+>/g, '')
                        .replace(/&nbsp;/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim()
                        .slice(0, 100) + '...'
                    : 'Tidak ada konten'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookmarkList;
