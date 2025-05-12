import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { toast } from 'react-hot-toast';
import { AlertCircle, CheckCircle, XCircle, Save } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import BuletinForm from '../components/BuletinForm';
import axios from 'axios';
import CLOUDINARY_CONFIG from '../services/cloudinary';

function EditBuletins() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchBuletin = async () => {
      try {
        const buletinRef = doc(db, 'buletins', id);
        const buletinSnap = await getDoc(buletinRef);

        if (!buletinSnap.exists()) {
          toast.error('Buletin tidak ditemukan.', {
            icon: <XCircle className="w-5 h-5" />
          });
          navigate('/my-bulletins');
          return;
        }

        const buletinData = buletinSnap.data();
        setInitialData({
          buletinName: buletinData.buletinName || '',
          description: buletinData.description || '',
          category: buletinData.category || '',
          customUrl: buletinData.customUrl || '',
          profileImageUrl: buletinData.profileImageUrl || ''
        });
      } catch (error) {
        console.error('Error:', error);
        toast.error('Terjadi kesalahan saat memuat data buletin.', {
          icon: <AlertCircle className="w-5 h-5" />
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBuletin();
  }, [id, navigate]);

  const handleImageUpload = async (file) => {
    try {
      setUploading(true);
      setError('');

      if (!file.type.match('image.*')) {
        throw new Error('File harus berupa gambar');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Ukuran file maksimal 5MB');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        formData
      );

      return response.data.secure_url;
    } catch (error) {
      console.error('Gagal upload gambar:', error);
      setError(error.message || 'Gagal mengupload gambar. Silakan coba lagi.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (form) => {
    try {
      const buletinRef = doc(db, 'buletins', id);
      await updateDoc(buletinRef, {
        buletinName: form.buletinName,
        description: form.description,
        category: form.category,
        customUrl: form.customUrl,
        profileImageUrl: form.profileImageUrl,
        updatedAt: new Date()
      });

      toast.success('Buletin berhasil diperbarui', {
        icon: <CheckCircle className="w-5 h-5" />
      });
      navigate('/my-bulletins');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Gagal memperbarui buletin.', {
        icon: <XCircle className="w-5 h-5" />
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Edit Buletin
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/my-bulletins')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Batal
              </button>
            </div>
          </div>

          <BuletinForm
            initialForm={initialData}
            onSubmit={handleSubmit}
            onImageUpload={handleImageUpload}
            uploading={uploading}
            error={error}
            buttonLabel="Simpan Perubahan"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default EditBuletins; 