// src/components/BuletinForm.jsx
import { useState } from 'react';

const BuletinForm = ({ onSubmit, loading, initialForm = {}, buttonLabel = "Submit" }) => {
  const topicList = JSON.parse(localStorage.getItem('selectedTopics')) || [];

  const [form, setForm] = useState({
    profileImageUrl: '',
    buletinName: '',
    description: '',
    category: '',
    customUrl: '',
    ...initialForm,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium">Profile Buletin (Image URL)</label>
        <input
          type="text"
          name="profileImageUrl"
          value={form.profileImageUrl}
          onChange={handleChange}
          placeholder="https://..."
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Buletin Name</label>
        <input
          type="text"
          name="buletinName"
          value={form.buletinName}
          onChange={handleChange}
          placeholder="Unique name"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Short Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Briefly describe..."
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Select Category</label>
        {topicList.length === 0 ? (
          <p className="text-red-500 text-sm">
            Kamu belum memilih topik. Silakan kembali ke onboarding untuk memilih kategori terlebih dahulu.
          </p>
        ) : (
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Pilih kategori --</option>
            {topicList.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block font-medium">Buletin URL</label>
        <div className="flex items-center">
          <span className="px-3 py-2 bg-gray-100 border border-r-0 rounded-l">
            https://buletin.co/
          </span>
          <input
            type="text"
            name="customUrl"
            value={form.customUrl}
            onChange={handleChange}
            placeholder="your-buletin"
            className="w-full border px-3 py-2 rounded-r"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : buttonLabel}
      </button>
    </div>
  );
};

export default BuletinForm;
