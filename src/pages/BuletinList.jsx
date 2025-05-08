import { useParams, Link } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useEffect, useState } from 'react'

function BuletinList() {
  const { userName } = useParams()
  const [buletins, setBuletins] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBuletins = async () => {
      try {
        // Ambil semua buletin milik user
        const q = query(
          collection(db, "buletin"),
          where("userName", "==", userName) // Ambil buletin dari user ini
        )
        const querySnapshot = await getDocs(q)
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        // Filter hanya buletin yang publik atau milik user yang login
        const filteredBuletins = items.filter(buletin => 
          buletin.isPublic || buletin.userName === userName  // Tampilkan buletin yang publik atau milik user
        )

        setBuletins(filteredBuletins)
      } catch (err) {
        console.error("Gagal mengambil buletin:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBuletins()
  }, [userName])

  if (loading) return <p className="text-center py-10">Memuat buletin...</p>

  if (buletins.length === 0)
    return <p className="text-center py-10 text-gray-500">Belum ada buletin dari <strong>{userName}</strong></p>

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-center text-blue-600">📚 Buletin oleh {userName}</h1>
      {buletins.map(b => (
        <div key={b.id} className="border p-4 rounded shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold">{b.buletinName}</h2>
          <p className="text-sm text-gray-500 mb-2">oleh {b.userName}</p>
          <p className="text-gray-700 line-clamp-3">{b.content}</p>
          <Link to={`/buletin/${b.id}`} className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            Lihat Detail →
          </Link>
        </div>
      ))}
    </div>
  )
}

export default BuletinList
