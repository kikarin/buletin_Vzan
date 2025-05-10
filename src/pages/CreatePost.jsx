import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { onAuthStateChanged } from 'firebase/auth';
import { saveBuletin } from '../services/saveBuletin';
import axios from 'axios';
import CLOUDINARY_CONFIG from '../services/cloudinary';

function CreatePost() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [userBuletins, setUserBuletins] = useState([]);
    const [selectedBuletins, setSelectedBuletins] = useState(null);

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [saved, setSaved] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setUserId(uid);
                setUserName(user.displayName || '');
                fetchUserBuletins(uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchUserBuletins = async (uid) => {
        try {
            const q = query(collection(db, 'buletins'), where('userId', '==', uid));
            const snapshot = await getDocs(q);
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserBuletins(list);
        } catch (err) {
            console.error("❌ Gagal mengambil buletins:", err);
        }
    };

    const handleSave = async () => {
        if (!selectedBuletins) {
            alert("❗Silakan pilih buletins terlebih dahulu.");
            return;
        }

        if (!title.trim() || !content.trim()) {
            alert("❗Judul dan isi tidak boleh kosong.");
            return;
        }

        try {
            const postData = {
                userId,
                userName,
                title,
                subtitle,
                content,
                isPublic,
                buletinId: selectedBuletins.id,
                buletinName: selectedBuletins.buletinName,
                category: selectedBuletins.category,
                buletinProfileImage: selectedBuletins.profileImageUrl || '',
                createdAt: new Date(),
            };

            await saveBuletin(postData);

            setSaved(true);
            navigate(`/dashboard`);
        } catch (error) {
            console.error("Error menyimpan buletin: ", error);
            alert("❌ Gagal menyimpan buletin.");
        }
    };

    const uploadAdapter = (loader) => {
        return {
            upload: async () => {
                try {
                    setUploading(true);
                    const file = await loader.file;
                    
                    // Validasi tipe file
                    if (!file.type.match('image.*')) {
                        throw new Error('File harus berupa gambar');
                    }

                    // Validasi ukuran file (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        throw new Error('Ukuran file maksimal 5MB');
                    }

                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
                    formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);

                    const response = await axios.post(
                        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
                        formData
                    );

                    return {
                        default: response.data.secure_url
                    };
                } catch (error) {
                    console.error('Gagal upload gambar:', error);
                    throw error;
                } finally {
                    setUploading(false);
                }
            }
        };
    };

    function uploadPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return uploadAdapter(loader);
        };
    }

    return (
        <div className="min-h-screen bg-white px-4 py-8 flex flex-col items-center">
            <div className="max-w-2xl w-full space-y-6">
                <h1 className="text-2xl font-bold text-center text-blue-600">
                    Kamu siap menulis buletin pertamamu ✍️
                </h1>

                <div>
                    <label className="block mb-1 font-semibold">Pilih Buletins</label>
                    <select
                        value={selectedBuletins?.id || ''}
                        onChange={(e) => {
                            const selected = userBuletins.find(b => b.id === e.target.value);
                            setSelectedBuletins(selected || null);
                        }}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">-- Pilih buletins --</option>
                        {userBuletins.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.buletinName}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedBuletins && (
                    <div className="text-center text-gray-600">
                        <p><strong>{selectedBuletins.buletinName}</strong></p>
                        <p>oleh <strong>{userName}</strong></p>
                    </div>
                )}

                <div className="border rounded overflow-hidden">
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
                    <CKEditor
                        editor={ClassicEditor}
                        data={content}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setContent(data);
                        }}
                        config={{
                            extraPlugins: [uploadPlugin],
                            toolbar: {
                                items: [
                                    'heading',
                                    '|',
                                    'bold',
                                    'italic',
                                    'link',
                                    'bulletedList',
                                    'numberedList',
                                    '|',
                                    'imageUpload',
                                    'blockQuote',
                                    'insertTable',
                                    'undo',
                                    'redo'
                                ]
                            },
                            image: {
                                toolbar: [
                                    'imageTextAlternative',
                                    'imageStyle:inline',
                                    'imageStyle:block',
                                    'imageStyle:side'
                                ]
                            }
                        }}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        id="isPublic"
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    <label htmlFor="isPublic" className="text-gray-700">Publikasikan buletin ini</label>
                </div>

                <div className="flex justify-between items-center">
                    <button
                        onClick={handleSave}
                        disabled={uploading}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                        {uploading ? 'Mengupload...' : 'Simpan'}
                    </button>
                    <button
                        onClick={() => navigate('/home')}
                        className="text-blue-600 hover:underline"
                    >
                        Selesai & Ke Beranda →
                    </button>
                </div>

                {saved && (
                    <p className="text-green-600 text-sm text-center">✅ Buletin disimpan di Firestore</p>
                )}
            </div>
        </div>
    );
}

export default CreatePost;
