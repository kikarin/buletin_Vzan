import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../services/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const topicList = JSON.parse(localStorage.getItem('selectedTopics')) || [];

function CreateBuletinStep1() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    profileImageUrl: '',
    buletinName: '',
    description: '',
    category: '',
    customUrl: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
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

      // Cek apakah customUrl sudah digunakan
      const buletinRef = doc(db, 'buletins', customUrl);
      const snapshot = await getDoc(buletinRef);
      if (snapshot.exists()) {
        alert('Buletin URL ini sudah digunakan. Silakan pilih yang lain.');
        setLoading(false);
        return;
      }

      // Simpan data ke Firestore
      const buletinData = {
        profileImageUrl,
        buletinName,
        description,
        category,
        customUrl,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      await setDoc(buletinRef, buletinData);

      // Simpan ke localStorage agar bisa dipakai di step 2
      localStorage.setItem('createdBuletin', JSON.stringify(buletinData));
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

      <div className="space-y-4">
        <div>
          <label className="block font-medium">Profile Buletin (Image URL)</label>
          <input
            type="text"
            name="profileImageUrl"
            value={form.profileImageUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Buletin Name</label>
          <input
            type="text"
            name="buletinName"
            value={form.buletinName}
            onChange={handleChange}
            placeholder="Unique name"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Short Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Briefly describe..."
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Select Category</label>
          {topicList.length === 0 ? (
            <p className="text-red-500 text-sm">Kamu belum memilih topik. Silakan kembali ke onboarding untuk memilih kategori terlebih dahulu.</p>
          ) : (
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-- Pilih kategori --</option>
              {topicList.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          )}

        </div>

        <div>
          <label className="block font-medium">Buletin URL</label>
          <div className="flex items-center">
            <span className="px-3 py-2 bg-gray-100 border border-r-0 rounded-l">
              https://buletin.co/
            </span>
            <input
              type="text"
              name="customUrl"
              value={form.customUrl}
              onChange={handleChange}
              placeholder="your-buletin"
              className="w-full border px-3 py-2 rounded-r"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Next'}
      </button>
    </div>
  );
}

export default CreateBuletinStep1;
