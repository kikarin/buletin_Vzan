import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link } from 'react-router-dom';

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return;
      const notifCol = collection(db, 'users', userId, 'notifications');
      const snapshot = await getDocs(notifCol);
      const notifData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const notif = { id: docSnap.id, ...docSnap.data() };
          // Ambil avatar pengirim jika fromUserId ada
          let avatarUrl = '';
          if (notif.fromUserId) {
            const userRef = doc(db, 'users', notif.fromUserId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              avatarUrl = userSnap.data().avatarUrl || '';
            }
          }
          // Fallback: jika tidak ada avatarUrl, pakai avatar default dari nama pengirim
          notif.avatarUrl = avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(notif.fromUser || 'U')}`;
          return notif;
        })
      );
      setNotifications(notifData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
      setLoading(false);

      // Tandai semua sebagai "dibaca"
      snapshot.docs.forEach(async (docSnap) => {
        if (!docSnap.data().isRead) {
          await updateDoc(docSnap.ref, { isRead: true });
        }
      });
    };

    fetchNotifications();
  }, [userId]);

  if (loading) return <p className="text-center mt-10">Memuat notifikasi...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">🔔 Notifikasi</h1>
      {notifications.length === 0 ? (
        <p>Kamu belum memiliki notifikasi.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map(notif => (
            <li key={notif.id} className="border p-4 rounded flex items-center gap-3">
              <img
                src={notif.avatarUrl}
                alt={notif.fromUser}
                className="w-8 h-8 rounded-full object-cover border"
              />
              <div className="flex-1">
                <p>
                  <strong>{notif.fromUser}</strong> mengomentari buletin{' '}
                  <Link to={`/buletin/${notif.buletinId}`} className="text-blue-600 underline">
                    {notif.buletinTitle}
                  </Link>
                </p>
                <p className="text-sm text-gray-600">{notif.createdAt ? new Date(notif.createdAt?.seconds * 1000).toLocaleString() : ''}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationPage;
