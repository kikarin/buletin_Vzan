import { useState } from 'react';
import { auth, db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import BubbleLayer from '../components/BubbleLayer';
import { Feather } from 'lucide-react';


function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        createdAt: Date.now(),
        avatarUrl: '',
        about: '',
        socialUrl: '',
      });

      localStorage.setItem('userId', user.uid);
      navigate('/login');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email sudah terdaftar. Silakan login atau gunakan email lain.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password terlalu lemah. Gunakan minimal 6 karakter.');
      } else {
        console.error('Registration error:', err);
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const isNewUser = result._tokenResponse?.isNewUser;

      const userDoc = doc(db, 'users', user.uid);

      if (isNewUser) {
        await setDoc(userDoc, {
          name: user.displayName || '',
          email: user.email,
          createdAt: Date.now(),
          avatarUrl: user.photoURL || '',
          about: '',
          socialUrl: '',
        });

        localStorage.setItem('userId', user.uid);
        navigate('/onboarding/1');
      } else {
        localStorage.setItem('userId', user.uid);
        navigate('/home');
      }
    } catch (err) {
      console.error('Google Sign-in error:', err);
      setError('Gagal masuk dengan Google. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans relative overflow-hidden">
      {/* Left: Register Form */}
      <div className="w-full flex items-center justify-center z-10">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm px-6 py-8 space-y-4">
          {/* Logo */}
          <div className="flex justify-center">
            <Feather className="w-12 h-12 text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Daftar Akun <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600/90 to-purple-600/90'>BuletinVzan</span>
          </h2>

          {/* Form Register */}
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Nama Lengkap"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Konfirmasi Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:scale-[1.02] transition"
            >
              Daftar
            </button>
          </form>

          {/* Divider */}
          <div className="relative text-center">
            <span className="text-sm text-gray-500 bg-white px-2 z-10 relative">atau daftar dengan Google</span>
            <div className="absolute left-0 top-1/2 w-full border-t border-gray-300 -z-0"></div>
          </div>

          {/* Google Register */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Daftar dengan Google
          </button>

          {/* Login link */}
          <p className="text-sm mt-6 text-center text-gray-600">
            Sudah punya akun?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Masuk di sini
            </span>
          </p>
        </div>
      </div>

      {/* Right: Background & Bubble */}
      <img
        src="https://app.buletin.co/images/landing/bg-blur.avif"
        width="1850"
        height="1691"
        alt=""
        className="absolute xl:-mt-5 top-1/2 -translate-y-1/2 xl:min-w-[1850px] h-fit sm:min-w-[1200px] min-w-[800px] left-1/2 -translate-x-1/2"
      />
      <BubbleLayer />
    </div>
  );
}

export default Register;
