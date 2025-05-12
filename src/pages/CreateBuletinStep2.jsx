import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

function CreateBuletinStep2() {
  const navigate = useNavigate();
  const [feeCoveredBy, setFeeCoveredBy] = useState('publisher');
  const [freePrice] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('basic');

  const handleNext = () => {
    if (freePrice === '' || isNaN(freePrice)) {
    }

    localStorage.setItem('accessPlans', JSON.stringify({
      selectedPlan,
      plans: {
        basic: { price: 99000, credits: 4 },
        standard: { price: 149000, credits: 8 },
        premium: { price: 199000, credits: 12 },
        free: { price: 0, credits: 0 },
      },
      feeCoveredBy,
    }));

    navigate('/create-buletin/step-3');
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-sm text-gray-700">
      <h1 className="text-2xl font-bold text-blue-600 mb-2">Pilih Paket Akses</h1>
      <p className="mb-6 text-gray-600">Tentukan model langganan untuk konten eksklusifmu.</p>

      {/* Plan Cards */}
      <div className="grid gap-4 mb-8">
        <PlanCard
          title="Basic Access"
          price="99000"
          credits="4"
          selected={selectedPlan === 'basic'}
          onSelect={() => setSelectedPlan('basic')}
        />
        <PlanCard
          title="Standard Access"
          price="149000"
          credits="8"
          selected={selectedPlan === 'standard'}
          onSelect={() => setSelectedPlan('standard')}
        />
        <PlanCard
          title="Premium Access"
          price="199000"
          credits="12"
          selected={selectedPlan === 'premium'}
          onSelect={() => setSelectedPlan('premium')}
        />
        <PlanCard
          title="Free Access"
          price="0"
          credits="0"
          selected={selectedPlan === 'free'}
          onSelect={() => setSelectedPlan('free')}
          isFree
        />
      </div>

      {/* Transaction Fee */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Biaya Transaksi (10%)</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="fee"
              checked={feeCoveredBy === 'publisher'}
              onChange={() => setFeeCoveredBy('publisher')}
              className="accent-blue-600"
            />
            <span>Kamu (Publisher)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="fee"
              checked={feeCoveredBy === 'subscriber'}
              onChange={() => setFeeCoveredBy('subscriber')}
              className="accent-blue-600"
            />
            <span>Subscriber</span>
          </label>
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:brightness-110 transition"
      >
        Lanjut ke Langkah 3 →
      </button>
    </div>
  );
}

function PlanCard({ title, price, credits, selected, onSelect, isFree = false }) {
  const value = title.toLowerCase().split(' ')[0];

  const getAccent = () => {
    switch (value) {
      case 'basic':
        return 'bg-red-500';
      case 'standard':
        return 'bg-orange-500';
      case 'premium':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`relative w-full rounded-xl p-4 border-2 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md
          ${selected ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-200'}
          bg-white hover:scale-[1.01]
        `}
    >
      {/* Dot checkmark */}
      <div className="absolute top-3 right-3">
        <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-gray-100 relative">
          {selected && (
            <div className={`absolute top-[2px] left-[2px] w-2 h-2 rounded-full ${getAccent()}`}></div>
          )}
        </div>
      </div>

      {/* Label & Price */}
      <div className="text-sm">
        <div className="font-bold text-gray-800 tracking-wide">{title.toUpperCase()}</div>
        <div className="mt-3 text-gray-700 font-semibold text-lg">
          {isFree ? (
            <span className="text-blue-500 font-bold">Gratis</span>
          ) : (
            <>
              <span className="text-gray-400 text-sm">Rp</span>{' '}
              {Number(price).toLocaleString('id-ID')}
              <span className="ml-1 text-sm text-gray-500">/bulan</span>
            </>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L2 9l10 12 10-12-10-6z" />
          </svg>
          {credits} kredit akses
        </p>
      </div>
    </div>
  );
}


export default CreateBuletinStep2;
