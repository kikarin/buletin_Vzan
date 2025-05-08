// src/pages/CreateBuletinStep1.jsx
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

function CreateBuletinStep1() {
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
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        alert('Buletin URL ini sudah digunakan. Silakan pilih yang lain.');
        setLoading(false);
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

      navigate('/create-buletin/step-2');
    } catch (error) {
      console.error('Gagal menyimpan buletin:', error);
      alert('Terjadi kesalahan saat menyimpan buletin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Create Your Buletin</h1>
      <p className="text-gray-600 mb-4">Start by adding details about your buletin.</p>
      <BuletinForm onSubmit={handleSubmit} loading={loading} buttonLabel="Next" />
    </div>
  );
}

export default CreateBuletinStep1;
