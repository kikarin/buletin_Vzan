import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateBuletinStep3() {
  const navigate = useNavigate();
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const handleSubmit = () => {
    if (!bankName || !accountHolder || !accountNumber) {
      alert('Semua field harus diisi');
      return;
    }

    // Simpan data ke localStorage atau Firestore
    localStorage.setItem('paymentInfo', JSON.stringify({
      bankName,
      accountHolder,
      accountNumber,
    }));

    // Redirect ke dashboard
    navigate('/dashboard');
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Select Payment Method</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
        <select
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Select Bank --</option>
          <option value="BCA">BCA</option>
          <option value="BNI">BNI</option>
          <option value="BRI">BRI</option>
          <option value="Mandiri">Mandiri</option>
          <option value="CIMB">CIMB</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
        <input
          type="text"
          value={accountHolder}
          onChange={(e) => setAccountHolder(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
        <input
          type="number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
      >
        Finish & Go to Dashboard
      </button>
    </div>
  );
}

export default CreateBuletinStep3;
