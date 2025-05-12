import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import HeroBackground from '../../components/HeroBackground';
import { toast } from 'react-hot-toast';

const topicList = [
  'Olahraga',
  'Teknologi',
  'Lifestyle',
  'Finansial',
  'Edukasi',
  'Seni',
  'Lingkungan',
  'Politik',
  'Kesehatan',
  'Sosial',
];

function Step3_Topics() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const toggleTopic = (topic) => {
    setSelected((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

const handleNext = async () => {
  if (selected.length === 0) {
    toast.error('Pilih minimal 1 topik untuk lanjut');
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    toast.error('User tidak ditemukan');
    return;
  }

  const userRef = doc(db, 'users', user.uid);

  try {
    await setDoc(userRef, { topics: selected }, { merge: true });
    toast.success('Topik berhasil disimpan');
    navigate('/onboarding/4');
  } catch (error) {
    console.error('Gagal menyimpan topik:', error);
    toast.error('Terjadi kesalahan saat menyimpan topik.');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <img
          src="https://app.buletin.co/images/landing/bg-blur.avif"
          width="1850"
          height="1691"
          alt=""
          className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 min-w-[1200px] sm:min-w-[1400px] xl:min-w-[1850px] h-fit"
        />
      </div>
      <div className="absolute inset-0 -z-10">
        <HeroBackground />
      </div>

      {/* Content */}
      <div className="z-20 w-full max-w-xl space-y-8 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 w-[75%] animate-pulse transition-all duration-500 ease-out"></div>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800">Pilih Topik Favoritmu</h2>
        <p className="text-center text-gray-500 text-sm">
          Pilih satu atau lebih agar buletinmu lebih relevan
        </p>

        {/* Topic Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {topicList.map((topic) => {
            const isSelected = selected.includes(topic);
            return (
              <button
                key={topic}
                onClick={() => toggleTopic(topic)}
                className={`px-5 py-2 rounded-full border transition-all duration-200 text-sm font-medium ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md scale-[1.03]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate('/onboarding/2')}
            className="text-gray-600 hover:underline font-medium"
          >
            ← Kembali
          </button>
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:scale-[1.02] transition shadow"
          >
            Selanjutnya →
          </button>
        </div>

        <p className="text-center text-sm text-gray-400">Langkah 3 dari 4</p>
      </div>
    </div>
  );
}

export default Step3_Topics;
