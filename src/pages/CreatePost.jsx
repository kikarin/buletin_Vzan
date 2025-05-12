import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { onAuthStateChanged } from 'firebase/auth';
import { saveBuletin } from '../services/saveBuletin';
import axios from 'axios';
import CLOUDINARY_CONFIG from '../services/cloudinary';
import { toast } from 'react-hot-toast';
import { Pen, X, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

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
            toast.error("Silakan pilih buletin terlebih dahulu.", {
                icon: <AlertCircle className="w-5 h-5" />
            });
            return;
        }

        if (!title.trim() || !content.trim()) {
            toast.error("Judul dan isi tidak boleh kosong.", {
                icon: <AlertCircle className="w-5 h-5" />
            });
            return;
        }

        try {
            const postData = {
                buletinId: selectedBuletins.id,
                buletinName: selectedBuletins.buletinName,
                buletinProfileImage: selectedBuletins.profileImageUrl,
                userId: localStorage.getItem('userId'),
                userName: localStorage.getItem('userName'),
                title,
                subtitle,
                content,
                isPublic,
                category: selectedBuletins.category,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            await saveBuletin(postData);
            toast.success('Buletin berhasil disimpan!', {
                icon: <CheckCircle className="w-5 h-5" />
            });
            setSaved(true);
            navigate(`/dashboard`);
        } catch (error) {
            console.error("Error menyimpan buletin: ", error);
            toast.error("Gagal menyimpan buletin.", {
                icon: <XCircle className="w-5 h-5" />
            });
        }
    };

    const handleCancel = () => {
        toast((t) => (
            <div className="bg-white px-4 py-3 rounded-lg shadow border text-sm text-gray-800 space-y-2">
                <p>Yakin ingin membatalkan?</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            navigate('/dashboard');
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                    >
                        Ya, Batal
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                    >
                        Lanjutkan Menulis
                    </button>
                </div>
            </div>
        ), { duration: 10000 });
    };

    const uploadAdapter = (loader) => {
        return {
            upload: async () => {
                try {
                    setUploading(true);
                    const file = await loader.file;

                    if (!file.type.match('image.*')) {
                        throw new Error('File harus berupa gambar');
                    }

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
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 px-4 py-10 flex justify-center">
            <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-8 space-y-8 relative">

                {/* Cancel button */}
                <button
                    onClick={handleCancel}
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Heading */}
                <div className="flex items-center justify-center gap-2">
                    <Pen className="w-5 h-5 text-blue-600" />
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-600">
                        Tulis Buletin Baru
                    </h1>
                </div>

                {/* Pilih Buletin */}
                <div>
                    <label className="block font-semibold text-gray-700 mb-1">Pilih Buletin</label>
                    <select
                        value={selectedBuletins?.id || ''}
                        onChange={(e) => {
                            const selected = userBuletins.find(b => b.id === e.target.value);
                            setSelectedBuletins(selected || null);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Pilih buletin --</option>
                        {userBuletins.map((b) => (
                            <option key={b.id} value={b.id}>{b.buletinName}</option>
                        ))}
                    </select>
                </div>

                {/* Info Buletin */}
                {selectedBuletins && (
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded text-sm text-center text-gray-600">
                        <p><strong>{selectedBuletins.buletinName}</strong></p>
                        <p>oleh <strong>{userName}</strong></p>
                    </div>
                )}

                {/* Judul & Subjudul */}
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Judul Buletin"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-lg font-semibold focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Subjudul (opsional)"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                {/* Editor */}
                <div className="border border-gray-300 rounded-lg bg-white shadow-sm">
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
                            }
                        }}
                    />
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                        id="isPublic"
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    <label htmlFor="isPublic">Publikasikan buletin ini</label>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={handleSave}
                        disabled={uploading}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:brightness-110 transition disabled:opacity-50"
                    >
                        {uploading ? 'Mengupload...' : 'Simpan'}
                    </button>
                    <button
                        onClick={() => navigate('/home')}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Selesai & Ke Beranda →
                    </button>
                </div>

                {saved && (
                    <p className="text-green-600 text-sm text-center">
                        <CheckCircle className="w-5 h-5 inline mr-1" />
                        Buletin berhasil disimpan
                    </p>
                )}
            </div>
        </div>
    );
}

export default CreatePost;
