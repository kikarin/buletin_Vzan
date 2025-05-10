import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, orderBy } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import UserRecommendations from '../components/UserRecommendations';

const allTopics = ['Olahraga', 'Teknologi', 'Lifestyle', 'Finansial', 'Edukasi', 'Seni', 'Lingkungan', 'Politik', 'Kesehatan'];

function Home() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState('For You');
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserName(data.name || '');
          localStorage.setItem('userName', data.name || '');
        }
      } catch (err) {
        console.error('Gagal ambil data user:', err);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData();
      }
    });

    return () => unsubscribe();
  }, []);

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

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserTopics();
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPublicPosts = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'posts'),
          where('isPublic', '==', true)
        );

        const querySnapshot = await getDocs(q);
        const postList = querySnapshot.docs
          .map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              ...data,
              createdAt: data.createdAt?.toDate?.() || new Date()
            };
          })
          .sort((a, b) => b.createdAt - a.createdAt);

        setPosts(postList);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicPosts();
  }, []);

  const handleTopicToggle = async (topic) => {
    const user = auth.currentUser;
    if (!user) return;

    const updated = selectedTopics.includes(topic)
      ? selectedTopics.filter(t => t !== topic)
      : [...selectedTopics, topic];

    setSelectedTopics(updated);
    localStorage.setItem('selectedTopics', JSON.stringify(updated));

    // Update di Firestore
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { topics: updated });
    } catch (err) {
      console.error('Gagal update topik:', err);
    }

    // Jika topic yang diuncheck adalah active topic, reset ke 'For You'
    if (activeTopic === topic) {
      setActiveTopic('For You');
    }
  };

  // Filter posts berdasarkan topik dan pencarian
  const filteredPosts = posts.filter((b) => {
    const matchesTopic = activeTopic === 'For You'
      ? selectedTopics.includes(b.category)
      : b.category === activeTopic;

    const matchesSearch = searchQuery === '' ||
      b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.buletinName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTopic && matchesSearch;
  });

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-t from-blue-100 to-white px-4 md:px-8 lg:px-36 py-10">
        <div className="max-w-7xl mx-auto">
          {/* Greeting + Search + Topics Combined */}
          <div className="relative max-w-7xl mx-auto mb-4 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-6 shadow-md border border-white/50">
            {/* Greeting Text */}
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-gray-800">
                Good to see you,&nbsp;
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {userName}
                </span>
              </h1>
              <p className="mt-1 text-lg text-gray-600">
                Dapatkan update terbaru dari buletin yang kamu ikuti.
              </p>
            </div>

            {/* Topic & Action Icons */}
            <div className="flex justify-between items-center mb-5">
              {/* Horizontal Scrollable Topics */}
              <div className="flex overflow-x-auto gap-2 whitespace-nowrap px-1 pb-1 scrollbar-hide">
                <button
                  onClick={() => setActiveTopic('For You')}
                  className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium ${activeTopic === 'For You'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  For You
                </button>
                {selectedTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setActiveTopic(topic)}
                    className={`min-w-max flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium ${activeTopic === topic
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Search Toggle */}
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition"
                  aria-label="Toggle Search"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                {/* Manage Topics */}
                <button
                  onClick={() => setShowModal(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition"
                  aria-label="Manage Topics"
                >
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.983 2c.327 0 .598.23.658.553l.37 2.117a8.056 8.056 0 011.947.843l1.848-1.202a.667.667 0 01.924.23l1.333 2.31a.667.667 0 01-.23.924l-1.847 1.202a8.014 8.014 0 01.001 1.688l1.847 1.202c.31.202.408.607.23.924l-1.333 2.31a.667.667 0 01-.924.23l-1.848-1.202a8.056 8.056 0 01-1.947.843l-.37 2.117a.667.667 0 01-.658.553h-2.666a.667.667 0 01-.658-.553l-.37-2.117a8.056 8.056 0 01-1.947-.843l-1.848 1.202a.667.667 0 01-.924-.23l-1.333-2.31a.667.667 0 01.23-.924l1.847-1.202a8.014 8.014 0 01-.001-1.688L2.78 7.735a.667.667 0 01-.23-.924l1.333-2.31a.667.667 0 01.924-.23l1.848 1.202a8.056 8.056 0 011.947-.843l.37-2.117A.667.667 0 019.317 2h2.666z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Toggleable Search Input */}
            <div
              className={`transition-all duration-300 overflow-hidden ${showSearch ? 'mb-2 max-h-[100px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari buletin..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <svg
                  className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
            {/* Posts Section */}
            <div className="space-y-1">
              {loading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent"></div>
                </div>
              ) : currentPosts.length === 0 ? (
                <div className="text-center text-gray-500 text-sm bg-white/60 backdrop-blur-md py-8 rounded-xl border border-gray-100 shadow">
                  {searchQuery
                    ? 'Tidak ada buletin yang cocok dengan pencarian.'
                    : 'Tidak ada buletin untuk topik ini.'}
                </div>
              ) : (
                currentPosts.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => navigate(`/buletin/${b.id}`)}
                    className="relative bg-white backdrop-blur-md rounded-2xl border border-black/10 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition duration-200 cursor-pointer group overflow-hidden"
                  >
                    {/* Accent bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-300 to-blue-50"></div>
                    <div className="flex flex-col sm:flex-row items-start gap-6 p-6">
                      {/* Left Content */}
                      <div className="flex-1 space-y-3">
                        {/* Author info */}
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <img
                            src={
                              b.buletinProfileImage ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(b.buletinName || 'B')}`
                            }
                            alt={b.buletinName}
                            className="w-9 h-9 rounded-full object-cover border"
                          />
                          <span className="font-medium text-gray-700">{b.buletinName || 'Unknown'}</span>
                          <span className="text-xs text-gray-400">
                            • {b.createdAt?.toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })
                              || 'Tidak diketahui'}
                          </span>
                        </div>
                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition">
                          {b.title || b.buletinName}
                        </h2>
                        {/* Subtitle */}
                        {b.subtitle && (
                          <p className="text-lg text-gray-700 italic">{b.subtitle}</p>
                        )}
                        {/* Snippet */}
                        <p className="text-base text-gray-500 line-clamp-3 leading-relaxed">
                          {b.content
                            ? b.content
                              .replace(/<[^>]+>/g, '')
                              .replace(/&nbsp;/g, ' ')
                              .replace(/\s+/g, ' ')
                              .trim()
                              .substring(0, 160) + '...'
                            : 'No content.'}
                        </p>
                        {/* Category badge */}
                        {b.category && (
                          <span className="inline-block mt-1 text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                            {b.category}
                          </span>
                        )}
                      </div>
                      {/* Thumbnail */}
                      {b.content && b.content.includes('<img') && (
                        <div className="w-full sm:w-36 h-36 flex-shrink-0 rounded-lg overflow-hidden border">
                          <img
                            src={b.content.match(/<img[^>]+src="([^">]+)"/)?.[1]}
                            alt="Post thumbnail"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex items-center gap-1 bg-white/70 backdrop-blur-lg border border-white/50 px-4 py-2 rounded-2xl shadow-md">
                    {/* First */}
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition"
                      aria-label="First Page"
                    >
                      <span className="text-gray-500 text-sm">«</span>
                    </button>
                    {/* Prev */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition"
                      aria-label="Previous Page"
                    >
                      <span className="text-gray-500">←</span>
                    </button>
                    {/* Pages */}
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1
                      const isActive = currentPage === page
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${isActive
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                    {/* Next */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition"
                      aria-label="Next Page"
                    >
                      <span className="text-gray-500">→</span>
                    </button>
                    {/* Last */}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition"
                      aria-label="Last Page"
                    >
                      <span className="text-gray-500 text-sm">»</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* User Recommendations Sidebar */}
            <div className="lg:sticky lg:top-6 h-fit">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-1">
                <UserRecommendations userTopics={selectedTopics} />
              </div>
            </div>

          </div>
        </div>
        {/* Modal for Topic Selection */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Pilih Topik Favoritmu
              </h2>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {allTopics.map((topic) => (
                  <label
                    key={topic}
                    className="flex items-center space-x-2 text-sm text-gray-700"
                  >
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

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                      localStorage.setItem('selectedTopics', JSON.stringify(selectedTopics));
                    } catch (err) {
                      console.error('Gagal simpan topik:', err);
                    }
                  }}
                  className="px-4 py-2 rounded-lg text-sm bg-gradient-to-t from-blue-700 to-purple-600 text-white hover:from-blue-600 hover:to-purple-500 transition"
                >
                  Simpan
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
