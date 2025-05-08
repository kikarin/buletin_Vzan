// src/pages/UserProfile.jsx
import { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


function UserProfile() {
  const userId = localStorage.getItem('userId');
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || '');
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [newUserName, setNewUserName] = useState(userName);
  const [newAvatar, setNewAvatar] = useState(avatar);
  const navigate = useNavigate(); // ⬅️ Tambahkan ini

  useEffect(() => {
    const fetchStats = async () => {
      // Hitung total likes dari semua buletin milik user
      const buletinSnapshot = await getDocs(query(collection(db, 'buletin'), where('userId', '==', userId)));
      let totalLikes = 0;
      for (const docSnap of buletinSnapshot.docs) {
        const likesCol = collection(doc(db, 'buletin', docSnap.id), 'likes');
        const likesSnap = await getDocs(likesCol);
        totalLikes += likesSnap.size;
      }

      // Hitung total komentar yang ditulis user
      let totalComments = 0;
      const allBuletins = await getDocs(collection(db, 'buletin'));
      for (const buletin of allBuletins.docs) {
        const commentsCol = collection(doc(db, 'buletin', buletin.id), 'comments');
        const commentsSnap = await getDocs(commentsCol);
        totalComments += commentsSnap.docs.filter(c => c.data().userId === userId).length;
      }

      setLikeCount(totalLikes);
      setCommentCount(totalComments);
    };

    if (userId) fetchStats();
  }, [userId]);

  const handleSaveProfile = async () => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        userName: newUserName,
        avatar: newAvatar,
      });
      localStorage.setItem('userName', newUserName);
      localStorage.setItem('avatar', newAvatar);
      setUserName(newUserName);
      setAvatar(newAvatar);
      alert('Profil diperbarui!');
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
      <div className="flex items-center gap-4 mb-4">
        {avatar && <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full" />}
        <input
          className="border p-2 w-full"
          placeholder="URL Avatar"
          value={newAvatar}
          onChange={(e) => setNewAvatar(e.target.value)}
        />
      </div>
      <input
        className="border p-2 w-full mb-4"
        placeholder="Nama Pengguna"
        value={newUserName}
        onChange={(e) => setNewUserName(e.target.value)}
      />
      <button onClick={handleSaveProfile} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Simpan Profil
      </button>

      <div className="mt-6">
        <h2 className="font-semibold mb-2">📊 Statistik</h2>
        <p>❤️ Total Like Diterima: {likeCount}</p>
        <p>💬 Total Komentar Dibuat: {commentCount}</p>
          </div>
          
          <div className="mt-8 text-center">
  <button
    onClick={handleLogout}
    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
  >
    Logout
  </button>
</div>

    </div>
  );
}

export default UserProfile;
