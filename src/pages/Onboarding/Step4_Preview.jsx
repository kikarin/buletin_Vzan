import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import HeroBackground from '../../components/HeroBackground';

function Step4_Preview() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [buletinName, setBuletinName] = useState('');
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserName(data.name || '');
        setBuletinName(data.buletinName || 'Buletin Tanpa Nama');
        setTopics(data.topics || []);
      }
    };

    fetchData();
  }, []);

  const handleConfirm = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { isOnboarded: true });
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden px-4 py-12">
      {/* Background Layers */}
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
      <div className="z-20 max-w-xl w-full space-y-8 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl text-center">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 w-full animate-pulse transition-all duration-500 ease-out"></div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800">Preview Buletin Kamu</h2>

        {/* Card Preview */}
        <div className="bg-white rounded-xl border shadow-md text-left p-6 space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-blue-700">{buletinName}</h3>
            <p className="text-sm text-gray-600">Oleh: {userName}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <span
                key={topic}
                className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => navigate('/onboarding/3')}
            className="text-gray-600 hover:underline font-medium"
          >
            ← Kembali
          </button>
          <button
            onClick={handleConfirm}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:scale-[1.02] transition shadow"
          >
            Konfirmasi & Selesai
          </button>
        </div>

        <p className="text-sm text-gray-400">Langkah 4 dari 4</p>
      </div>
    </div>
  );
}

export default Step4_Preview;
