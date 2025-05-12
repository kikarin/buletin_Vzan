import { useEffect, useState } from "react";

const ProfileForm = ({ initialData, onChange, onSave }) => {
  const [form, setForm] = useState(initialData);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setForm(initialData);
    setIsDirty(false);
  }, [initialData]);

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);

    const isDirty =
      updated.name !== initialData.name ||
      updated.about !== initialData.about ||
      updated.socialUrl !== initialData.socialUrl ||
      updated.avatarUrl !== initialData.avatarUrl;

    onChange(updated);
    setIsDirty(isDirty);
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Nama */}
      <div className="relative">
        <input
          type="text"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-transparent"
          placeholder=" " 
        />
        <label
          className="absolute left-4 top-2 text-sm text-gray-500 transition-all 
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base 
          peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-500"
        >
          Nama Lengkap
        </label>
      </div>

      {/* Tentang */}
      <div className="relative">
        <textarea
          value={form.about}
          onChange={(e) => handleChange("about", e.target.value)}
          className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-transparent resize-none"
          placeholder=" "
          rows={3}
        />
        <label
          className="absolute left-4 top-2 text-sm text-gray-500 transition-all 
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base 
          peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-500"
        >
          Tentang Kamu
        </label>
      </div>

      {/* Social */}
      <div className="relative">
        <input
          type="text"
          value={form.socialUrl}
          onChange={(e) => handleChange("socialUrl", e.target.value)}
          className="mt-1 peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-transparent"
          placeholder=" "
        />
        <label
          className="absolute left-4 top-2 text-sm text-gray-500 transition-all 
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base 
          peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-500"
        >
          URL Sosial Media (opsional)
        </label>
      </div>

      <button
        onClick={() => onSave(form)}
        disabled={!isDirty}
        className="w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Simpan Perubahan
      </button>
    </div>
  );
};

export default ProfileForm;
