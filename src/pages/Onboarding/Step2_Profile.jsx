import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import { db, auth } from '../../services/firebase'

function Step2_Profile() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [socialUrl, setSocialUrl] = useState('')
  const [error, setError] = useState('')
  const [profileImage, setProfileImage] = useState(null)

  useEffect(() => {
    const user = auth.currentUser
    if (user) {
      setName(user.displayName || '')
      setProfileImage(user.photoURL || null)
    }
  }, [])

  const getInitials = (fullName) => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  const handleNext = async () => {
    if (name.trim().length < 3) {
      setError('Nama lengkap minimal 3 karakter')
      return
    }
  
    const user = auth.currentUser
    if (!user) {
      setError('User tidak ditemukan')
      return
    }
  
    const userRef = doc(db, 'users', user.uid)
  
    try {
      await setDoc(userRef, {
        name: name.trim(),
        about: about.trim(),
        socialUrl: socialUrl.trim(),
        avatarUrl: profileImage || null  // ← tambahkan avatarUrl di sini
      }, { merge: true })
  
      // Simpan lokal opsional
      localStorage.setItem('userName', name.trim())
      localStorage.setItem('userAbout', about.trim())
      localStorage.setItem('userSocialUrl', socialUrl.trim())
      localStorage.setItem('userAvatar', profileImage || '')
  
      navigate('/onboarding/3')
    } catch (error) {
      console.error('Gagal menyimpan profil:', error)
      setError('Gagal menyimpan data. Coba lagi.')
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-600">Setup Profil Penulis</h2>

        <div className="flex justify-center">
          {profileImage ? (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-400 hover:scale-105 transition-all">
              <img
                src={profileImage}
                alt="User Avatar"
                onError={(e) => {
                  console.warn('Gagal load gambar profile dari Google. Gunakan default.');
                  e.target.onerror = null; // Hindari infinite loop
                  e.target.src = '/default-avatar.png';
                }}
                className="w-full h-full object-cover"
              />


            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold border-4 border-blue-300 hover:scale-105 transition-all">
              {getInitials(name || 'A')}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
          <textarea
            placeholder="Tell us about yourself..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full border rounded px-4 py-2"
            rows={4}
          />
          <input
            type="url"
            placeholder="URL Sosial Media (Opsional)"
            value={socialUrl}
            onChange={(e) => setSocialUrl(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/onboarding/1')}
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

        <p className="text-center text-sm text-gray-400">Langkah 2 dari 4</p>
      </div>
    </div>
  )
}

export default Step2_Profile
