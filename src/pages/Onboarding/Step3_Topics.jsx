import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, auth } from '../../services/firebase'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'


const topicList = ['Olahraga','Teknologi', 'Lifestyle', 'Finansial', 'Edukasi', 'Seni', 'Lingkungan', 'Politik', 'Kesehatan']

function Step3_Topics() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState([])

  const toggleTopic = (topic) => {
    if (selected.includes(topic)) {
      setSelected(selected.filter((t) => t !== topic))
    } else {
      setSelected([...selected, topic])
    }
  }

  const handleNext = async () => {
    if (selected.length === 0) {
      alert("Pilih minimal 1 topik untuk lanjut")
      return
    }
  
    const user = auth.currentUser
    if (!user) return alert("User tidak ditemukan")
  
    const userRef = doc(db, 'users', user.uid)
  
    try {
      await setDoc(userRef, { topics: selected }, { merge: true })
      navigate('/onboarding/4')
    } catch (error) {
      console.error('Gagal menyimpan topik:', error)
      alert('Terjadi kesalahan saat menyimpan topik.')
    }
  }
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-600">Pilih Topik Favoritmu</h2>
        <p className="text-center text-gray-500 text-sm">Pilih satu atau lebih agar buletinmu lebih relevan</p>

        <div className="flex flex-wrap gap-2 justify-center">
          {topicList.map((topic) => (
            <button
              key={topic}
              onClick={() => toggleTopic(topic)}
              className={`px-4 py-2 rounded-full border ${
                selected.includes(topic)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/onboarding/2')}
            className="text-gray-500 hover:underline"
          >
            ← Kembali
          </button>
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Selanjutnya →
          </button>
        </div>

        <p className="text-center text-sm text-gray-400">Langkah 3 dari 4</p>
      </div>
    </div>
  )
}

export default Step3_Topics
