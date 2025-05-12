import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, BarChart2, Globe, Lock } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

function MyBulletins() {
  const navigate = useNavigate();
  const [bulletins, setBulletins] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchBulletins();
  }, []);

  const fetchBulletins = async () => {
    try {
      const q = query(collection(db, 'buletins'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const bulletinsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBulletins(bulletinsList);
    } catch (error) {
      console.error('Error fetching bulletins:', error);
      toast.error('Gagal memuat buletin');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col">
        <span>Apakah Anda yakin ingin menghapus buletin ini?</span>
        <div className="mt-2 flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteDoc(doc(db, 'buletins', id));
                toast.success('Buletin berhasil dihapus');
                fetchBulletins();
              } catch (error) {
                console.error('Error deleting bulletin:', error);
                toast.error('Gagal menghapus buletin');
              }
            }}
            className="px-2 py-1 bg-red-500 text-white rounded text-sm"
          >
            Ya, Hapus
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-sm"
          >
            Batal
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
    });
  };
  const handleEdit = (id) => {
    navigate(`/edit-bulletin/${id}`);
  };

  const handleView = (id) => {
    navigate(`/buletin/${id}`);
  };

  const handleCreate = () => {
    navigate('/create-buletins');
  };

  const togglePublish = async (id, isPublic) => {
    try {
      await updateDoc(doc(db, 'posts', id), { isPublic: !isPublic });
      toast.success(`Buletin berhasil ${isPublic ? 'disembunyikan' : 'dipublikasikan'}`);
      fetchBulletins();
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast.error('Gagal mengubah status publikasi');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Buletin Saya</h1>
            <p className="text-gray-600 mt-1">Kelola semua buletin yang telah Anda buat</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition"
          >
            <Plus className="w-5 h-5" />
            Buat Buletin Baru
          </button>
        </div>

        {bulletins.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum ada buletin</h3>
            <p className="text-gray-600 mb-6">Mulai buat buletin pertama Anda</p>
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Buat Buletin
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bulletins.map((buletin) => (
              <div
                key={buletin.id}
                className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={buletin.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(buletin.buletinName || 'B')}`}
                      alt={buletin.buletinName}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{buletin.buletinName}</h3>
                      <p className="text-sm text-gray-500">{buletin.customUrl}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(buletin.id)}
                      className="p-2 text-gray-600 hover:text-blue-600 transition"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(buletin.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{buletin.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                    {buletin.category}
                  </span>
                  <span className="text-gray-500">
                    {buletin.createdAt?.toDate?.().toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) || 'Tidak diketahui'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default MyBulletins; 