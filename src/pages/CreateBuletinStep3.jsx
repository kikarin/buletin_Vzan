import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BankCard from '../components/BankCard';
import TransactionLoader from '../components/TransactionLoader';


function CreateBuletinStep3() {
  const navigate = useNavigate();
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!bankName || !accountHolder || !accountNumber) {
      alert('Semua field harus diisi');
      return;
    }
  
    setIsLoading(true);
  
    setTimeout(() => {
      localStorage.setItem('paymentInfo', JSON.stringify({
        bankName,
        accountHolder,
        accountNumber,
      }));
  
      navigate('/dashboard');
    }, 3000); // Simulasi delay 2 detik untuk loader
  };
  

  const formatCardNumber = (num) => {
    return num.replace(/\D/g, '').padEnd(16, '*').replace(/(.{4})/g, '$1 ').trim();
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white/70 backdrop-blur-sm">
        <TransactionLoader />
      </div>
    );
  }
  
  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 shadow p-6 space-y-6">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Informasi Pembayaran
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Masukkan detail bank untuk menerima penghasilan dari buletinmu.
          </p>
        </div>
        {/* Bank Card Preview */}
        <div className="flex justify-center">
          <BankCard name={accountHolder} number={formatCardNumber(accountNumber)} />
        </div>
        {/* Bank Selector */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Pilih Bank</label>
          <select
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="peer w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white/90"
          >
            <option value="">-- Pilih Bank --</option>
            <option value="BCA">BCA</option>
            <option value="BNI">BNI</option>
            <option value="BRI">BRI</option>
            <option value="Mandiri">Mandiri</option>
            <option value="CIMB">CIMB</option>
          </select>
        </div>
        {/* Account Holder */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Pemilik Rekening</label>
          <input
            type="text"
            value={accountHolder}
            onChange={(e) => setAccountHolder(e.target.value)}
            placeholder="Contoh: Budi Santoso"
            className="peer w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400 bg-white/90"
          />
        </div>
        {/* Account Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Rekening</label>
          <input
            type="number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:brightness-110 transition"
        >
          Selesai & Masuk Dashboard
        </button>
      </div>
    </div>
  );
}

export default CreateBuletinStep3;
