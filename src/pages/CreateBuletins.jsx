import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import BuletinForm from '../components/BuletinForm';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateBuletins = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        toast.error('URL buletin sudah digunakan. Coba yang lain.');
        setLoading(false);
        return;
      }

      const newBuletin = {
        profileImageUrl,
        buletinName,
        description,
        category,
        customUrl,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'buletins'), newBuletin);
      toast.success('Buletin berhasil dibuat!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating buletin:', error);
      toast.error('Terjadi kesalahan saat menyimpan buletin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8 relative">
      {/* Tombol X */}
      <button
        onClick={() => {
          toast((t) => (
            <div className="bg-white px-4 py-3 rounded-lg shadow border text-sm text-gray-800 space-y-2">
              <p>Yakin batal membuat buletin?</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    navigate('/dashboard');
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                >
                  Batalin
                </button>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                >
                  Lanjutkan
                </button>
              </div>
            </div>
          ), { duration: 10000 });
        }}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
      >
        <X className="w-5 h-5" />
      </button>

      <h1 className="text-2xl font-bold mb-6 text-blue-600">Buat Buletin</h1>
      <p className="text-gray-600 mb-4">Tambahkan detail untuk buletin tambahanmu.</p>

      <BuletinForm onSubmit={handleSubmit} loading={loading} buttonLabel="Save" />
    </div>
  );

};

export default CreateBuletins;
