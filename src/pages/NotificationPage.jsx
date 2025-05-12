import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Bell } from 'lucide-react';

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

          let avatarUrl = '';
          if (notif.fromUserId && typeof notif.fromUserId === 'string') {
            const userRef = doc(db, 'users', notif.fromUserId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const data = userSnap.data();
              avatarUrl = typeof data.avatarUrl === 'string' && data.avatarUrl.startsWith('http')
                ? data.avatarUrl
                : '';
            }
          }

          const fallbackName = notif.fromUser || notif.buletinTitle || 'Pengguna';
          notif.avatarUrl = avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}`;
          return notif;
        })
      );

      setNotifications(
        notifData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
      );
      setLoading(false);

      snapshot.docs.forEach(async (docSnap) => {
        if (!docSnap.data().isRead) {
          await updateDoc(docSnap.ref, { isRead: true });
        }
      });
    };


    fetchNotifications();
  }, [userId]);

  return (
    <DashboardLayout>
      <div className="w-full px-4 md:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-600">Pemberitahuan</h1>
        </div>

        {/* Loading */}
        {loading ? (
          <p className="text-center text-sm text-gray-500">Memuat notifikasi...</p>
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-600 mt-10">
            <p className="text-lg">Tidak ada notifikasi saat ini.</p>
            <p className="text-sm text-gray-500">Notifikasi akan muncul jika ada interaksi.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notif) => {
              const waktu = notif.createdAt
                ? new Date(notif.createdAt.seconds * 1000).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }) +
                ', ' +
                new Date(notif.createdAt.seconds * 1000).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
                : '';

              return (
                <li
                  key={notif.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-md hover:shadow transition"
                >
                  <img
                    src={notif.avatarUrl}
                    alt={notif.fromUser || 'User'}
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(notif.fromUser || 'User')}`;
                    }}
                    className="w-10 h-10 rounded-full object-cover border border-blue-200"
                  />
                  <div className="flex-1 space-y-1 text-sm text-gray-700">
                    <p>
                      <strong>{notif.fromUser}</strong> mengomentari buletin{' '}
                      <Link
                        to={`/buletin/${notif.buletinId}`}
                        className="text-blue-600 hover:underline"
                      >
                        {notif.buletinTitle}
                      </Link>
                    </p>
                    <p className="text-xs text-gray-500">• {waktu}</p>
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

export default NotificationPage;
