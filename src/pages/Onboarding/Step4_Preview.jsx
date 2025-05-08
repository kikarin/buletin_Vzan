import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, auth } from '../../services/firebase'
import { doc, getDoc } from 'firebase/firestore'

function Step4_Preview() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [buletinName, setBuletinName] = useState('')
  const [topics, setTopics] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser
      if (!user) return
  
      const userRef = doc(db, 'users', user.uid)
      const userSnap = await getDoc(userRef)
  
      if (userSnap.exists()) {
        const data = userSnap.data()
        setUserName(data.name || '')
        setBuletinName(data.buletinName || '')
        setTopics(data.topics || [])
      }
    }
  
    fetchData()
  }, [])
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <h2 className="text-2xl font-bold text-blue-600">Preview Buletin Kamu</h2>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md text-left">
          <h3 className="text-xl font-semibold mb-2 text-blue-800">{buletinName}</h3>
          <p className="text-gray-600 mb-4">Oleh: {userName}</p>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <span key={topic} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
  <button
    onClick={() => navigate('/onboarding/3')}
    className="text-gray-500 hover:underline"
  >
    ← Kembali
  </button>
  <button
    onClick={() => navigate('/home')}
    className="bg-blue-600 text-white px-4 py-2 rounded"
  >
    Konfirmasi & Selesai
  </button>
</div>


        <p className="text-sm text-gray-400">Langkah 4 dari 4 </p>
      </div>
    </div>
  )
}

export default Step4_Preview
