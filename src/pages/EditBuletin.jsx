import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import CLOUDINARY_CONFIG from '../services/cloudinary';
import { toast } from 'react-hot-toast';
import { AlertCircle, CheckCircle, XCircle, Save } from 'lucide-react';

function EditBuletin() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [userName, setUserName] = useState('');
    const [buletinName, setBuletinName] = useState('');
    const [uploading, setUploading] = useState(false);
    const [isPublic, setIsPublic] = useState(false);

    useEffect(() => {
        const fetchBuletin = async () => {
            try {
                const buletinRef = doc(db, 'posts', id);
                const buletinSnap = await getDoc(buletinRef);

                if (!buletinSnap.exists()) {
                    toast.error('Buletin tidak ditemukan.', {
                        icon: <XCircle className="w-5 h-5" />
                    });
                    navigate('/dashboard');
                    return;
                }

                const buletinData = buletinSnap.data();
                setTitle(buletinData.title || '');
                setSubtitle(buletinData.subtitle || '');
                setContent(buletinData.content || '');
                setIsPublic(buletinData.isPublic || false);
                setUserName(buletinData.userName || '');
                setBuletinName(buletinData.buletinName || '');
            } catch (error) {
                console.error('Error:', error);
                toast.error('Terjadi kesalahan saat memuat data buletin.', {
                    icon: <AlertCircle className="w-5 h-5" />
                });
            } finally {
                setLoading(false);
            }
        };

        fetchBuletin();
    }, [id, navigate]);

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

    const handleSave = async () => {
        try {
            const buletinRef = doc(db, 'posts', id);
            await updateDoc(buletinRef, {
                title,
                subtitle,
                content,
                isPublic,
                updatedAt: new Date()
            });

            toast.success('Buletin berhasil diperbarui', {
                icon: <CheckCircle className="w-5 h-5" />
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Gagal memperbarui buletin.', {
                icon: <XCircle className="w-5 h-5" />
            });
        }
    };

    if (loading) {
        return <p className="text-center py-10">Memuat data buletin...</p>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Edit Buletin
                        </h1>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
                            >
                                <XCircle className="w-5 h-5" />
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                Simpan
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Judul Buletin
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Masukkan judul buletin"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi
                            </label>
                            <textarea
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px]"
                                placeholder="Masukkan deskripsi buletin"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Konten
                            </label>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={content}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setContent(data);
                                    }}
                                    config={{
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
                                                'outdent',
                                                'indent',
                                                '|',
                                                'blockQuote',
                                                'insertTable',
                                                'undo',
                                                'redo',
                                            ],
                                        },
                                        language: 'id',
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Publikasikan</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditBuletin;
