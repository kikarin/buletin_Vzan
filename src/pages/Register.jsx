// src/pages/Register.jsx
import { useState } from 'react'
import { auth } from '../services/firebase'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)

  const handleRegister = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Password tidak cocok')
      return
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: name })
      navigate('/onboarding/1')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      navigate('/onboarding/1')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AuthLayout title="Daftar Akun">
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Nama Lengkap"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <input
          type="password"
          placeholder="Konfirmasi Password"
          className="w-full border p-2 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Daftar
        </button>
      </form>

      <div className="mt-6">
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Daftar dengan Google
        </button>
      </div>
      <p className="text-sm mt-4 text-center text-gray-600">
        Sudah punya akun?{' '}
        <span
          onClick={() => navigate('/login')}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          Masuk di sini
        </span>
      </p>

    </AuthLayout>
  )
}

export default Register
