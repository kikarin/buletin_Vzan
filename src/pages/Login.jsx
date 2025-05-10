// src/pages/Login.jsx
import { useState } from 'react'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../services/firebase'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import BubbleLayer from '../components/BubbleLayer';

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      localStorage.setItem('userId', user.uid)

      // Ambil data user dari Firestore
      const userRef = doc(db, 'users', user.uid)
      const userSnap = await getDoc(userRef)

      let isOnboarded = false

      if (userSnap.exists()) {
        const userData = userSnap.data()
        isOnboarded = userData.isOnboarded === true
      }

      navigate(isOnboarded ? '/home' : '/onboarding/1')
    } catch (err) {
      const errorCode = err.code
      let message = 'Terjadi kesalahan. Coba lagi.'

      if (errorCode === 'auth/invalid-credential') {
        message = 'Email atau password salah.'
      } else if (errorCode === 'auth/user-not-found') {
        message = 'Akun tidak ditemukan.'
      } else if (errorCode === 'auth/wrong-password') {
        message = 'Password salah.'
      } else if (errorCode === 'auth/network-request-failed') {
        message = 'Gagal terhubung ke jaringan.'
      }

      setError(message)
    }
  }


  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      localStorage.setItem('userId', user.uid)

      const userRef = doc(db, 'users', user.uid)
      const userSnap = await getDoc(userRef)

      let isOnboarded = false

      if (!userSnap.exists()) {
        // Jika user baru, buat data awal
        await setDoc(userRef, {
          email: user.email || '',
          name: user.displayName || '',
          isOnboarded: false,
          createdAt: new Date()
        })
      } else {
        const userData = userSnap.data()
        isOnboarded = userData.isOnboarded === true
      }

      navigate(isOnboarded ? '/home' : '/onboarding/1')
    } catch (err) {
      const errorCode = err.code
      let message = 'Akun anda belum terdaftar.'

      if (errorCode === 'auth/invalid-credential') {
        message = 'Email atau password salah.'
      } else if (errorCode === 'auth/user-not-found') {
        message = 'Akun tidak ditemukan.'
      } else if (errorCode === 'auth/wrong-password') {
        message = 'Password salah.'
      } else if (errorCode === 'auth/network-request-failed') {
        message = 'Gagal terhubung ke jaringan.'
      }

      setError(message)
    }
  }
  return (
    <div className="min-h-screen flex bg-white font-sans relative overflow-hidden">
      {/* Left: Login Form */}
      <div className="w-full flex items-center justify-center z-10">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm px-6 py-8 space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <img src="/src/assets/logo-t.png" alt="BuletinVzan Logo" className="w-12 h-12" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Masuk Akun BuletinVzan!
          </h2>

          {/* Form Login */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@gmail.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:scale-[1.02] transition"
            >
              Masuk
            </button>
          </form>

          {/* Divider */}
          <div className="relative text-center">
            <span className="text-sm text-gray-500 bg-white px-2 z-10 relative">atau masuk dengan Google</span>
            <div className="absolute left-0 top-1/2 w-full border-t border-gray-300 -z-0"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Masuk dengan Google
          </button>

          {/* Register link */}
          <p className="text-sm mt-6 text-center text-gray-600">
            Belum punya akun?{' '}
            <span
              onClick={() => navigate('/register')}
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Daftar di sini
            </span>
          </p>
        </div>
      </div>

      {/* Right: Bubble Background */}
        {/* Centered Logo */}
        <img src="https://app.buletin.co/images/landing/bg-blur.avif" width="1850" height="1691" alt=""
                    class="absolute xl:-mt-5 top-1/2 -translate-y-1/2 xl:min-w-[1850px] h-fit sm:min-w-[1200px] min-w-[800px] left-1/2 -translate-x-1/2" />
        <BubbleLayer />
    </div>
  );
}
export default Login
