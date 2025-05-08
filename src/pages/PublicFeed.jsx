import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";

function PublicFeed() {
  const [buletins, setBuletins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicBuletins = async () => {
      try {
        const q = query(
          collection(db, "buletin"),
          where("isPublic", "==", true)
          // Jika ingin mengurutkan berdasarkan waktu, pastikan setiap dokumen punya field createdAt
          // orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });
        setBuletins(results);
      } catch (err) {
        console.error("Gagal mengambil buletin publik:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicBuletins();
  }, []);

  const filteredBuletins = buletins.filter((item) =>
    item.buletinName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center mt-10">Memuat buletin...</p>;

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">📢 Public Feed Buletin</h1>

        <input
          type="text"
          placeholder="Cari buletin berdasarkan judul, isi, atau penulis..."
          className="w-full mb-6 px-4 py-2 border rounded shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredBuletins.length === 0 ? (
          <p>Tidak ada buletin yang cocok.</p>
        ) : (
          <ul className="space-y-4">
            {filteredBuletins.map((item) => (
              <li
                key={item.id}
                onClick={() => navigate(`/buletin/${item.id}`)}
                className="cursor-pointer p-4 border rounded-lg hover:bg-gray-50"
              >
                    <h2 className="font-semibold text-lg">{item.buletinName}</h2>
                    <p className="text-gray-800 line-clamp-3">{item.content}</p>
                <p className="text-sm text-gray-600">Dibuat oleh: {item.userName}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PublicFeed;
