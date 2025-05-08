import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc, collection, setDoc, getDocs, serverTimestamp  } from 'firebase/firestore';
import { db } from '../services/firebase';

function BuletinDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [buletin, setBuletin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [bookmarked, setBookmarked] = useState(false);

  // Komponen Form Balasan
  function ReplyForm({ onSubmit }) {
    const [replyText, setReplyText] = useState('');
    return (
      <div className="mt-2">
        <input
          className="w-full border px-2 py-1 rounded text-sm"
          placeholder="Balas komentar..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <button
          className="mt-1 text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
          onClick={() => {
            if (replyText.trim()) {
              onSubmit(replyText);
              setReplyText('');
            }
          }}
        >
          Kirim Balasan
        </button>
      </div>
    );
  }

  // Ambil detail buletin
  useEffect(() => {
    const fetchBuletin = async () => {
      try {
        const docRef = doc(db, 'buletins', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBuletin(data);
          setIsPublic(data.isPublic);
        } else {
          console.warn('Buletin tidak ditemukan');
        }
      } catch (err) {
        console.error('Gagal mengambil buletin:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBuletin();
  }, [id]);

  // Cek status like dan jumlah like
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!id || !userId) return;
      const likeRef = doc(db, 'buletin', id, 'likes', userId);
      const likeSnap = await getDoc(likeRef);
      setLiked(likeSnap.exists());

      const likesCol = collection(db, 'buletin', id, 'likes');
      const likesSnapshot = await getDocs(likesCol);
      setLikeCount(likesSnapshot.size);
    };
    checkLikeStatus();
  }, [id, userId]);

  // Cek bookmark
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!userId || !id) return;
      const bookmarkRef = doc(db, 'users', userId, 'bookmarks', id);
      const bookmarkSnap = await getDoc(bookmarkRef);
      setBookmarked(bookmarkSnap.exists());
    };
    checkBookmarkStatus();
  }, [id, userId]);

  // Ambil komentar + balasan
  useEffect(() => {
    const fetchComments = async () => {
      const commentsCol = collection(db, 'buletin', id, 'comments');
      const snapshot = await getDocs(commentsCol);
      const commentsData = await Promise.all(snapshot.docs.map(async (docSnap) => {
        const repliesCol = collection(docSnap.ref, 'replies');
        const repliesSnapshot = await getDocs(repliesCol);
        const replies = repliesSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        return { id: docSnap.id, ...docSnap.data(), replies };
      }));
      setComments(commentsData);
    };
    if (id) fetchComments();
  }, [id]);

  // Toggle Like
  const handleLikeToggle = async () => {
    const likeRef = doc(db, 'buletin', id, 'likes', userId);
    try {
      if (liked) {
        await deleteDoc(likeRef);
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        await setDoc(likeRef, { likedAt: new Date() });
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Gagal memproses like:", error);
    }
  };

  // Kirim Komentar
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const commentRef = doc(collection(db, 'buletin', id, 'comments'));
    await setDoc(commentRef, {
      userId,
      userName,
      content: newComment,
      createdAt: serverTimestamp()
    });
    setNewComment('');

    // Notifikasi ke pemilik buletin
    try {
      if (buletin?.userId && userId !== buletin.userId)        {
        const notifRef = doc(collection(db, 'users', buletin.userId, 'notifications'));
        await setDoc(notifRef, {
          type: 'comment',
          fromUserId: userId,
          fromUserName: userName,
          buletinId: id,
          createdAt: serverTimestamp(),
          message: `${userName} mengomentari buletinmu`
        });
      }
    } catch (err) {
      console.error("Gagal mengirim notifikasi:", err);
    }


  

    const snapshot = await getDocs(collection(db, 'buletin', id, 'comments'));
    const commentsData = await Promise.all(snapshot.docs.map(async (docSnap) => {
      const repliesCol = collection(docSnap.ref, 'replies');
      const repliesSnapshot = await getDocs(repliesCol);
      const replies = repliesSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      return { id: docSnap.id, ...docSnap.data(), replies };
    }));
    setComments(commentsData);    
  };

  // Kirim Balasan
  const handleReplySubmit = async (commentId, replyText) => {
    const replyRef = doc(collection(db, 'buletin', id, 'comments', commentId, 'replies'));
    await setDoc(replyRef, {
      userId,
      userName,
      content: replyText,
      createdAt: serverTimestamp()
    });

    // Refresh komentar
    const snapshot = await getDocs(collection(db, 'buletin', id, 'comments'));
    const commentsData = await Promise.all(snapshot.docs.map(async (docSnap) => {
      const repliesCol = collection(docSnap.ref, 'replies');
      const repliesSnapshot = await getDocs(repliesCol);
      const replies = repliesSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      return { id: docSnap.id, ...docSnap.data(), replies };
    }));
    setComments(commentsData);
  };

  // Toggle Bookmark
  const handleBookmarkToggle = async () => {
    const bookmarkRef = doc(db, 'users', userId, 'bookmarks', id);
    try {
      if (bookmarked) {
        await deleteDoc(bookmarkRef);
        setBookmarked(false);
      } else {
        await setDoc(bookmarkRef, {
          buletinId: id,
          bookmarkedAt: new Date(),
          buletinName: buletin?.buletinName || '',
        });
        setBookmarked(true);
      }
    } catch (err) {
      console.error('Gagal toggle bookmark:', err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading detail...</p>;
  if (!buletin) return <p className="text-center mt-10">Buletin tidak ditemukan.</p>;

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <button className="text-blue-600 hover:underline mb-4" onClick={() => navigate(-1)}>
          ← Kembali
        </button>
        {/* Nama Buletin */}
        {buletin.buletinName && (
          <p className="text-sm text-blue-500 uppercase tracking-wide mb-1">
            {buletin.buletinName}
          </p>
        )}

        {/* Judul Artikel */}
        {buletin.title && (
          <h1 className="text-4xl font-bold mb-2">{buletin.title}</h1>
        )}
    <div className="p-6">
      <h1 className="text-2xl font-bold">{buletin.buletinName}</h1>
      <p className="text-gray-700">{buletin.description}</p>
    </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleLikeToggle}
            className={`px-3 py-1 rounded text-white ${liked ? 'bg-red-500' : 'bg-gray-500'} hover:opacity-80`}
          >
            ❤️ {liked ? 'Liked' : 'Like'}
          </button>
          <span className="text-gray-700">{likeCount} likes</span>
        </div>

        <button
          onClick={handleBookmarkToggle}
          className={`mt-2 px-3 py-1 rounded text-white ${bookmarked ? 'bg-green-600' : 'bg-gray-500'} hover:opacity-80`}
        >
          📌 {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Komentar</h3>
          <textarea
            className="w-full border p-2 rounded"
            rows="3"
            placeholder="Tulis komentar..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleCommentSubmit} className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
            Kirim
          </button>

          <div className="mt-4 space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border p-3 rounded">
                <p className="font-medium">
                  <span className="text-blue-700 font-semibold">{comment.userName}:</span> {comment.content}
                </p>
                <div className="ml-4 mt-2">
                  <h4 className="text-sm font-semibold">Balasan:</h4>
                  {comment.replies?.map(reply => (
                    <p key={reply.id} className="text-sm ml-2">
                      ↪️ <span className="text-green-700 font-semibold">{reply.userName}:</span> {reply.content}
                    </p>
                  ))}
                  <ReplyForm onSubmit={(text) => handleReplySubmit(comment.id, text)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuletinDetail;
