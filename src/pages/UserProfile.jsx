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
import { toast } from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';
import ProfileHeader from '../components/ProfileHeader';
import ProfileForm from '../components/ProfileForm';
import ProfileStats from '../components/ProfileStats';

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
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState('');

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
      let totalBookmarks = 0;
      let totalPosts = 0;

      postSnapshot.forEach(doc => {
        const data = doc.data();
        totalLikes += data.likes?.length || 0;
        totalBookmarks += data.bookmarks?.length || 0;
        totalPosts++;
      });

      const subSnap = await getDocs(collection(db, 'users', userId, 'subscribers'));
      const totalSubscribers = subSnap.size;

      setLikeCount(totalLikes);
      setBookmarkCount(totalBookmarks);
      setPostCount(totalPosts);
      setSubscriberCount(totalSubscribers);
    };

    fetchStats();
  }, [userId]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setError('File harus berupa gambar');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        formData
      );

      const newAvatarUrl = response.data.secure_url;
      setEditProfile(prev => ({
        ...prev,
        avatarUrl: newAvatarUrl
      }));

      setProfile(prev => ({
        ...prev,
        avatarUrl: newAvatarUrl
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

      toast.success('Profil diperbarui!', {
        icon: <CheckCircle className="w-5 h-5" />
      });

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
    <div className="max-w-3xl mx-auto p-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-md border border-gray-200 mt-10">
      <button
        onClick={() => navigate('/dashboard')}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
        title="Kembali ke beranda"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800">Profil Saya</h1>
        </div>
        <p className="text-sm text-gray-500 text-center">Perbarui informasi profil kamu di bawah ini.</p>
      </div>
      {loading ? (
        <p>Memuat profil...</p>
      ) : (
        <>
          <ProfileHeader
            previewImage={previewImage}
            uploading={uploading}
            error={error}
            onImageChange={handleImageUpload}
          />
          <ProfileForm
            initialData={profile}
            onChange={(updated) => setEditProfile(updated)}
            onSave={handleSaveProfile}
          />

          <ProfileStats
            stats={{
              likes: likeCount,
              bookmarks: bookmarkCount,
              posts: postCount,
              subscribers: subscriberCount,
            }}
          />

          <div className="mt-5 flex justify-center">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2 rounded-lg shadow transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9V4m0 16a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              Keluar
            </button>
          </div>

        </>
      )}
    </div>
  );
}

export default UserProfile;
