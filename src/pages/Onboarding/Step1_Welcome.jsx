// src/pages/Onboarding/Step1_Welcome.jsx
import { useNavigate } from 'react-router-dom'

function Step1_Welcome() {
  const navigate = useNavigate()

  const handleNext = () => {
    navigate('/onboarding/2')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-blue-600">Selamat Datang di Buletin.co 🎉</h1>
        <p className="text-gray-600 text-lg">
          Bangun komunitas lewat tulisanmu. Kami bantu dari nol sampai kamu punya buletin sendiri.
        </p>
        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Mulai Sekarang
        </button>
        <p className="text-sm text-gray-500">Langkah 1 dari 4</p>
      </div>
    </div>
  )
}

export default Step1_Welcome
