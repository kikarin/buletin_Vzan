import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx'; // pastikan sudah install: npm install clsx

function CreateBuletinStep2() {
  const navigate = useNavigate();
  const [feeCoveredBy, setFeeCoveredBy] = useState('publisher');
  const [freePrice, setFreePrice] = useState('');
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
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Set Your Access Plans</h1>
      <p className="mb-6 text-gray-600">
        Create pricing options for subscribers to unlock your paid posts.
      </p>

      <div className="grid grid-cols-1 gap-4 mb-6">
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
          price={freePrice !== '' ? freePrice : '0'}
          credits="0"
          selected={selectedPlan === 'free'}
          onSelect={() => setSelectedPlan('free')}
          isFree
        />
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Transaction Fee (10%)</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="fee"
              checked={feeCoveredBy === 'publisher'}
              onChange={() => setFeeCoveredBy('publisher')}
            />
            <span>Publisher (You)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="fee"
              checked={feeCoveredBy === 'subscriber'}
              onChange={() => setFeeCoveredBy('subscriber')}
            />
            <span>Paid Subscribers</span>
          </label>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Next
      </button>
    </div>
  );
}

function PlanCard({ title, price, credits, selected, onSelect, isFree = false, inputValue, onInputChange }) {
  return (
    <div
      onClick={onSelect}
      className={clsx(
        "bg-white p-4 rounded shadow cursor-pointer border",
        selected ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-200"
      )}
    >
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="font-semibold text-lg">{title}</h2>
          <p className="text-sm text-gray-600">{credits} credits</p>
        </div>
        <div className="text-right font-semibold text-blue-600">Rp {price}</div>
      </div>
    </div>
  );
}

export default CreateBuletinStep2;
