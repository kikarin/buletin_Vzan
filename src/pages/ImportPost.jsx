// src/pages/ImportPost.jsx
import { useState } from 'react';

function ImportPost() {
  const [url, setUrl] = useState('');

  const handleImport = () => {
    if (!url) {
      alert('Masukkan URL terlebih dahulu.');
      return;
    }

    // Placeholder logika import
    console.log('Mengimpor dari URL:', url);
    alert(`Konten dari ${url} akan diimpor (simulasi)`);
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">📥 Import Post</h1>
      <p className="mb-4 text-gray-600">Masukkan URL artikel atau buletin yang ingin kamu impor.</p>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/post"
        className="w-full border px-4 py-2 rounded mb-4"
      />
      <button
        onClick={handleImport}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Import
      </button>
    </div>
  );
}

export default ImportPost;
