import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../services/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import BuletinForm from '../components/BuletinForm';
import axios from 'axios';
import CLOUDINARY_CONFIG from '../services/cloudinary';
import toast from 'react-hot-toast';

function CreateBuletinStep1() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (file) => {
    if (!file) return;

    if (!file.type.match('image.*')) {
      setError('File harus berupa gambar');
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return null;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        formData
      );

      return response.data.secure_url;
    } catch (err) {
      console.error('Gagal upload gambar:', err);
      setError('Gagal mengupload gambar. Silakan coba lagi.');
      toast.error('Upload gambar gagal');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    toast((t) => (
      <span className="text-sm text-gray-800">
        Yakin batalkan buletin?
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              navigate('/home');
            }}
            className="px-3 py-1 bg-red-500 text-white rounded text-xs"
          >
            Ya, Batalkan
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 border text-xs rounded"
          >
            Batal
          </button>
        </div>
      </span>
    ), {
      duration: 6000,
    });
  };

  const handleSubmit = async (form) => {
    const { buletinName, description, category, customUrl, profileImageUrl } = form;

    if (!buletinName || !description || !category || !customUrl) {
      toast.error('Semua field wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Kamu harus login terlebih dahulu');
        return;
      }

      const q = query(collection(db, 'buletins'), where('customUrl', '==', customUrl));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        toast.error('URL buletin ini sudah digunakan');
        return;
      }

      const buletinData = {
        profileImageUrl,
        buletinName,
        description,
        category,
        customUrl,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'buletins'), buletinData);
      const buletinWithId = { ...buletinData, id: docRef.id };

      localStorage.setItem('createdBuletin', JSON.stringify(buletinWithId));
      localStorage.setItem('hasBuletin', 'true');

      toast.success('Buletin berhasil dibuat!');
      navigate('/create-buletin/step-2');
    } catch (error) {
      console.error('Gagal menyimpan buletin:', error);
      toast.error('Terjadi kesalahan saat menyimpan buletin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-10">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/50 relative">
        {/* Tombol X */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          title="Batalkan"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Buat Buletin Kamu</h1>
          <p className="text-sm text-gray-600 mt-2">Mulai dengan mengisi detail buletinmu secara lengkap.</p>
        </div>

        <BuletinForm 
          onSubmit={handleSubmit} 
          loading={loading} 
          buttonLabel="Selanjutnya"
          onImageUpload={handleImageUpload}
          uploading={uploading}
          error={error}
        />
      </div>
    </div>
  );
}

export default CreateBuletinStep1;
