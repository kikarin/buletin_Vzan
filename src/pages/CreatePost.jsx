import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { onAuthStateChanged } from 'firebase/auth';
import { saveBuletin } from '../services/saveBuletin';


function CreatePost() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [buletinName, setBuletinName] = useState('');
    const [content, setContent] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [saved, setSaved] = useState(false);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [category, setCategory] = useState('');
    const [userId, setUserId] = useState('');
    const [buletinProfileImage, setBuletinProfileImage] = useState('');
    const [userBuletins, setUserBuletins] = useState([]);
    const [selectedBuletinsId, setSelectedBuletinsId] = useState('');

    useEffect(() => {
        const savedBuletin = JSON.parse(localStorage.getItem('createdBuletin')) || {};
        setUserName(localStorage.getItem('userName') || '');
        setBuletinName(savedBuletin.buletinName || '');
        setCategory(savedBuletin.category || '');
        setBuletinProfileImage(savedBuletin.profileImage || savedBuletin.profileImageUrl || '');

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setUserId(uid);
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
            console.log("Buletins milik user:", list);
            setUserBuletins(list);
        } catch (err) {
            console.error("❌ Gagal mengambil buletins:", err);
        }
    };

    const handleSave = async () => {
        if (!selectedBuletinsId) {
            alert("❗Silakan pilih buletins terlebih dahulu.");
            return;
        }

        try {
            const selectedBuletins = userBuletins.find(b => b.id === selectedBuletinsId);

            if (!selectedBuletins) {
                alert("❗Data buletins tidak valid.");
                return;
            }

            const postData = {
                userId,
                userName,
                title,
                subtitle,
                content,
                isPublic,
                buletinsId: selectedBuletinsId,
                buletinName: selectedBuletins.buletinName || '',
                category: selectedBuletins.category || '',
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

    return (
        <div className="min-h-screen bg-white px-4 py-8 flex flex-col items-center">
            <div className="max-w-2xl w-full space-y-6">
                <h1 className="text-2xl font-bold text-center text-blue-600">
                    Kamu siap menulis buletin pertamamu ✍️
                </h1>

                <div>
                    <label className="block mb-1 font-semibold">Pilih Buletins</label>
                    <select
                        value={selectedBuletinsId}
                        onChange={(e) => {
                            const selectedId = e.target.value;
                            setSelectedBuletinsId(selectedId);
                            const selected = userBuletins.find(b => b.id === selectedId);
                            if (selected) {
                                setBuletinName(selected.buletinName || '');
                                setCategory(selected.category || '');
                                setBuletinProfileImage(selected.profileImageUrl || '');
                            }
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

                <div className="text-center text-gray-600">
                    <p><strong>{buletinName}</strong></p>
                    <p>oleh <strong>{userName}</strong></p>
                </div>

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
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    >
                        Simpan
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
