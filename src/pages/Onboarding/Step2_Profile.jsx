import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import { db, auth } from '../../services/firebase'
import axios from 'axios'
import CLOUDINARY_CONFIG from '../../services/cloudinary'
import HeroBackground from '../../components/HeroBackground';

function Step2_Profile() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [socialUrl, setSocialUrl] = useState('')
  const [error, setError] = useState('')
  const [profileImage, setProfileImage] = useState(null)
  const [uploading, setUploading] = useState(false)


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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.match('image.*')) {
      setError('File harus berupa gambar')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset)
      formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName)

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        formData
      )

      setProfileImage(response.data.secure_url)
    } catch (err) {
      console.error('Gagal upload gambar:', err)
      setError('Gagal mengupload gambar. Silakan coba lagi.')
    } finally {
      setUploading(false)
    }
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
        avatarUrl: profileImage || null
      }, { merge: true })

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
        {/* Progress Indicator */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 w-[50%] animate-pulse transition-all duration-500 ease-out"></div>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800">Setup Profil Penulis</h2>

        {/* Avatar Upload */}
        <div className="flex justify-center">
          <div className="relative">
            {profileImage ? (
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-400 hover:scale-105 transition-all">
                <img
                  src={profileImage}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold border-4 border-blue-300 hover:scale-105 transition-all">
                {getInitials(name || 'A')}
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </div>
        </div>
        {uploading && (
          <p className="text-sm text-gray-500 text-center mt-2 animate-pulse">
            Mengupload gambar...
          </p>
        )}

        {/* Form Inputs */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <textarea
            placeholder="Ceritakan sedikit tentang dirimu..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={4}
          />
          <input
            type="url"
            placeholder="URL Sosial Media (Opsional)"
            value={socialUrl}
            onChange={(e) => setSocialUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/onboarding/1')}
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

        <p className="text-center text-sm text-gray-400">Langkah 2 dari 4</p>
      </div>
    </div>
  );
}
export default Step2_Profile
