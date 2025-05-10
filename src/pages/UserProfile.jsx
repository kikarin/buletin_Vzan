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
import axios from 'axios';
import CLOUDINARY_CONFIG from '../services/cloudinary';

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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState('');

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
        setPreviewImage(data.avatarUrl || '');
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.match('image.*')) {
      setError('File harus berupa gambar');
      return;
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Preview gambar
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload ke Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        formData
      );

      setEditProfile(prev => ({
        ...prev,
        avatarUrl: response.data.secure_url
      }));
    } catch (err) {
      console.error('Gagal upload gambar:', err);
      setError('Gagal mengupload gambar. Silakan coba lagi.');
    } finally {
      setUploading(false);
    }
  };
    
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
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              {previewImage ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-400">
                  <img
                    src={previewImage}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </div>
            {uploading && <p className="text-sm text-gray-500 mt-2">Mengupload gambar...</p>}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
