// src/pages/CreateBuletins.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import BuletinForm from '../components/BuletinForm';

const CreateBuletins = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form) => {
    const { buletinName, description, category, customUrl, profileImageUrl } = form;

    if (!buletinName || !description || !category || !customUrl) {
      alert('Semua field wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Kamu harus login terlebih dahulu');
        return;
      }

      const q = query(collection(db, 'buletins'), where('customUrl', '==', customUrl));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        alert('Buletin URL ini sudah digunakan. Silakan pilih yang lain.');
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
      alert('Buletin berhasil dibuat!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating buletin:', error);
      alert('Terjadi kesalahan saat menyimpan buletin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Create Buletins</h1>
      <p className="text-gray-600 mb-4">Tambahkan detail untuk buletins tambahanmu.</p>
      <BuletinForm onSubmit={handleSubmit} loading={loading} buttonLabel="Save" />
    </div>
  );
};

export default CreateBuletins;
