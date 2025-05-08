// src/pages/Login.jsx
import { useState } from 'react'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../services/firebase'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';


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
    <AuthLayout title="Login">
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Masuk
        </button>
      </form>

      <div className="mt-6">
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Masuk dengan Google
        </button>
      </div>
      <p className="text-sm mt-4 text-center text-gray-600">
        Belum punya akun?{' '}
        <span
          onClick={() => navigate('/register')}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          Daftar di sini
        </span>
      </p>

    </AuthLayout>
  )
}

export default Login
