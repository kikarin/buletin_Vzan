// src/pages/Landing.jsx
import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-blue-100 to-white">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-blue-700">Selamat Datang di Buletin.co</h1>
        <p className="text-gray-600 text-lg">
          Buat dan kelola buletinmu, bangun komunitas lewat tulisan, dan temukan pembaca yang tepat.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <button
            onClick={() => navigate('/register')}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Mulai Sekarang
          </button>
          <button
            onClick={() => navigate('/login')}
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded hover:bg-blue-50 transition"
          >
            Sudah Punya Akun?
          </button>
        </div>
      </div>
    </div>
  )
}

export default Landing
