import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { collection,query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebase';

const allTopics = ['Olahraga', 'Teknologi', 'Lifestyle', 'Finansial', 'Edukasi', 'Seni', 'Lingkungan', 'Politik', 'Kesehatan'];

function Home() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState('For You');
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  

  useEffect(() => {
    const fetchUserTopics = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          const topics = data.topics || [];
          setSelectedTopics(topics);
          localStorage.setItem('selectedTopics', JSON.stringify(topics));
        }
      } catch (err) {
        console.error('Gagal ambil topik user:', err);
      }
    };

    // fetch hanya setelah auth state siap
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserTopics();
      }
    });

    return () => unsubscribe(); // cleanup
  }, []);


  useEffect(() => {
    const fetchBuletinsWithAuthors = async () => {
      try {
        const q = query(collection(db, 'posts'), where('isPublic', '==', true));
        const querySnapshot = await getDocs(q);
  
        const postsWithUserData = await Promise.all(
          querySnapshot.docs.map(async (docSnap) => {
            const postData = { id: docSnap.id, ...docSnap.data() };
            let authorData = { userName: 'Unknown', photoURL: null };
  
            if (postData.userId) {
              const userRef = doc(db, 'users', postData.userId);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                const data = userSnap.data();
                authorData = {
                  userName: data.fullName || data.userName || 'Unknown',
                  photoURL: data.photoURL || null,
                };
              }
            }
  
            return { ...postData, author: authorData };
          })
        );
  
        setPosts(postsWithUserData);
      } catch (error) {
        console.error('Error fetching buletins:', error);
      }
    };
  
    fetchBuletinsWithAuthors();
  }, []);
  
  
  

  const handleTopicToggle = (topic) => {
    const updated = selectedTopics.includes(topic)
      ? selectedTopics.filter(t => t !== topic)
      : [...selectedTopics, topic];

    setSelectedTopics(updated);
    localStorage.setItem('selectedTopics', JSON.stringify(updated));
  };

  const filteredPosts = posts.filter((b) => {
    if (activeTopic === 'For You') {
      return selectedTopics.includes(b.category);
    }
    return b.category === activeTopic;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Greeting */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-600">Good to see you, {userName}!</h1>
            <p className="text-gray-600">
              Stay updated with the latest posts from your favorite buletins.
            </p>
          </div>

          {/* Topic Selector */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <button
              onClick={() => setActiveTopic('For You')}
              className={`px-4 py-2 rounded-full border ${activeTopic === 'For You'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
                }`}
            >
              For You
            </button>
            {selectedTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => setActiveTopic(topic)}
                className={`px-4 py-2 rounded-full border ${activeTopic === topic
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
                  }`}
              >
                {topic}
              </button>
            ))}
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-full border border-blue-400 text-blue-600 hover:bg-blue-50"
            >
              ⚙️ Manage Topics
            </button>
          </div>

          {/* Buletin List */}
          <div className="mt-6 space-y-4">
            {filteredPosts.length === 0 ? (
              <p className="text-center text-gray-500">
                Tidak ada buletin untuk topik ini.
              </p>
            ) : (
              filteredPosts.map((b) => (
                <div
                  key={b.id}
                  onClick={() => navigate(`/buletin/${b.id}`)}
                  className="bg-white p-4 rounded shadow cursor-pointer hover:bg-blue-50 transition"
                >
                  <h2 className="font-semibold text-lg">{b.title || b.buletinName}</h2>
                  {b.subtitle && (
                    <p className="text-sm text-gray-500 mb-1">{b.subtitle}</p>
                  )}
                  <p className="text-gray-700">
                    {b.content ? b.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...' : 'No content.'}
                  </p>
                  {/* Konten Buletin (HTML) */}

                  <div className="text-xs text-gray-400 mt-1">By {b.userName || 'Unknown'}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Topic Selector */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4 text-blue-600">Manage Topics</h2>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {allTopics.map((topic) => (
                  <label key={topic} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedTopics.includes(topic)}
                      onChange={() => handleTopicToggle(topic)}
                      className="accent-blue-600"
                    />
                    <span>{topic}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setShowModal(false);
                    setActiveTopic('For You');

                    const user = auth.currentUser;
                    if (!user) return;

                    try {
                      const userRef = doc(db, 'users', user.uid);
                      await updateDoc(userRef, { topics: selectedTopics });
                      localStorage.setItem('selectedTopics', JSON.stringify(selectedTopics)); // optional cache
                    } catch (err) {
                      console.error('Gagal simpan topik:', err);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>

              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
