import { useState } from 'react';

const BuletinForm = ({
  onSubmit,
  loading,
  initialForm = {},
  buttonLabel = "Submit",
  onImageUpload,
  uploading,
  error
}) => {
  const topicList = JSON.parse(localStorage.getItem('selectedTopics')) || [];

  const [form, setForm] = useState({
    profileImageUrl: '',
    buletinName: '',
    description: '',
    category: '',
    customUrl: '',
    ...initialForm,
  });

  const [previewImage, setPreviewImage] = useState(initialForm.profileImageUrl || '');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    const imageUrl = await onImageUpload(file);
    if (imageUrl) {
      setForm(prev => ({ ...prev, profileImageUrl: imageUrl }));
    }
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <div className="space-y-6 text-sm text-gray-700">
      {/* Upload Section (Centered) */}
      <div className="flex justify-center">
        <div className="flex justify-center relative w-24 h-24">
          {/* Lingkaran Foto Profil */}
          <div className="w-full h-full rounded-full border-4 border-blue-500 overflow-hidden bg-gray-100">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}
          </div>

          {/* Ikon Edit - Diluar lingkaran, tapi masih dalam container */}
          <label
            htmlFor="profile-upload"
            className="absolute bottom-4 right-4 translate-x-1/2 translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full cursor-pointer shadow z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </label>

          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={uploading}
          />
        </div>

      </div>
      {uploading && <p className="text-center text-xs text-gray-500">Mengupload gambar...</p>}
      {error && <p className="text-center text-xs text-red-500">{error}</p>}

      {/* Buletin Name */}
      <div>
        <label className="block font-semibold mb-1">Nama Buletin</label>
        <input
          type="text"
          name="buletinName"
          value={form.buletinName}
          onChange={handleChange}
          placeholder="Contoh: Finansial Cerdas"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-semibold mb-1">Deskripsi Singkat</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Ceritakan secara singkat tentang buletin kamu"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block font-semibold mb-1">Kategori</label>
        {topicList.length === 0 ? (
          <p className="text-sm text-red-500">Kamu belum memilih topik. Silakan selesaikan onboarding dulu.</p>
        ) : (
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">-- Pilih kategori --</option>
            {topicList.map((topic) => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        )}
      </div>

      {/* Custom URL */}
      <div>
        <label className="block font-semibold mb-1">URL Buletin</label>
        <div className="flex">
          <span className="px-4 py-2 bg-gray-100 border border-r-0 rounded-l-lg text-sm text-gray-500">
            buletin.co/
          </span>
          <input
            type="text"
            name="customUrl"
            value={form.customUrl}
            onChange={handleChange}
            placeholder="nama-kustom"
            className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading || uploading}
        className="w-full mt-4 py-2 rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:brightness-110 transition disabled:opacity-50"
      >
        {loading ? 'Menyimpan...' : buttonLabel}
      </button>
    </div>
  );

};

export default BuletinForm;