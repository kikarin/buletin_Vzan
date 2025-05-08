// src/pages/EditBuletin.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function EditBuletin() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [userName, setUserName] = useState('');
    const [buletinName, setBuletinName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, 'buletins', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log("Data konten yang didapat:", data.content);

                    setTitle(data.title || '');
                    setSubtitle(data.subtitle || '');
                    setContent(data.content || '');
                    setUserName(data.userName || '');
                    setBuletinName(data.buletinName || '');
                } else {
                    alert('❌ Buletin tidak ditemukan.');
                    navigate('/');
                }
            } catch (err) {
                console.error('Gagal mengambil data:', err);
                alert('Terjadi kesalahan saat memuat data buletin.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleUpdate = async () => {
        try {
            await updateDoc(doc(db, 'buletins', id), {
                title,
                subtitle,
                content,
                updatedAt: new Date(),
            });

            alert('✅ Buletin berhasil diperbarui');
            navigate('/dashboard');
        } catch (err) {
            console.error('Gagal update:', err);
            alert('❌ Gagal memperbarui buletin.');
        }
    };

    if (loading) {
        return <p className="text-center py-10">Memuat data buletin...</p>;
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold text-blue-600 mb-4">✏️ Edit Buletin</h1>
            <h2 className="text-lg font-semibold mb-1">{buletinName}</h2>
            <p className="text-sm text-gray-500 mb-4">oleh {userName}</p>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Judul buletin"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border p-3 rounded text-lg font-semibold"
                />
                <input
                    type="text"
                    placeholder="Subjudul (opsional)"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full border p-2 rounded text-sm text-gray-600 mt-2"
                />

                <div className="mt-4">
                    <CKEditor
                        editor={ClassicEditor}
                        data={content}
                        onReady={(editor) => {
                            editor.setData(content);
                        }}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setContent(data);
                        }}
                    />
                </div>
            </div>

            <div className="mt-4 flex gap-4">
                <button
                    onClick={handleUpdate}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Simpan Perubahan
                </button>
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-500 underline"
                >
                    Batal
                </button>
            </div>
        </div>
    );
}

export default EditBuletin;
