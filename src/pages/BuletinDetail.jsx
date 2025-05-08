import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  doc, getDoc, updateDoc, arrayUnion, collection, addDoc, getDocs, deleteDoc, setDoc
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import BuletinContent from '../components/BuletinContent';
import LikeButton from '../components/LikeButton';
import BookmarkButton from '../components/BookmarkButton';
import CommentSection from '../components/CommentSection';

function BuletinDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buletin, setBuletin] = useState(null);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Dengarkan perubahan auth dan set user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, [auth]);

  // Ambil buletin setelah user terdeteksi
  useEffect(() => {
    const fetchBuletin = async () => {
      if (!id || !user) return;

      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBuletin({ id: docSnap.id, ...data });
          setLikeCount(data.likes?.length || 0);
          setLiked(data.likes?.includes(user.uid));
          setBookmarked(data.bookmarks?.includes(user.uid));
        }

        const commentRef = collection(db, 'posts', id, 'comments');
        const commentSnap = await getDocs(commentRef);
        const commentList = commentSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setComments(commentList);
      } catch (err) {
        console.error("Gagal ambil data buletin:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuletin();
  }, [id, user]);

  const handleToggleLike = async () => {
    const docRef = doc(db, 'posts', id);
    const updatedLikes = liked
      ? buletin.likes.filter(uid => uid !== user.uid)
      : [...(buletin.likes || []), user.uid];

    await updateDoc(docRef, { likes: updatedLikes });
    setLiked(!liked);
    setLikeCount(updatedLikes.length);
    setBuletin(prev => ({ ...prev, likes: updatedLikes }));
  };

  const handleToggleBookmark = async () => {
    const postRef = doc(db, 'posts', id);
    const userBookmarkRef = doc(db, 'users', user.uid, 'bookmarks', id); // ref ke subkoleksi bookmark

    const updatedBookmarks = bookmarked
      ? buletin.bookmarks.filter(uid => uid !== user.uid)
      : [...(buletin.bookmarks || []), user.uid];

    try {
      await updateDoc(postRef, { bookmarks: updatedBookmarks });

      if (bookmarked) {
        // Hapus dari koleksi bookmark user
        await deleteDoc(userBookmarkRef);
      } else {
        // Tambah ke koleksi bookmark user
        await setDoc(userBookmarkRef, { bookmarkedAt: new Date() });
      }

      setBookmarked(!bookmarked);
      setBuletin(prev => ({ ...prev, bookmarks: updatedBookmarks }));
    } catch (err) {
      console.error("Gagal toggle bookmark:", err);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    const comment = {
      userId: user.uid,
      userName: user.displayName || 'Anonim',
      content: newComment,
      createdAt: new Date(),
      replies: []
    };

    const commentRef = collection(db, 'posts', id, 'comments');
    const docRef = await addDoc(commentRef, comment);
    setComments(prev => [...prev, { id: docRef.id, ...comment }]);
    setNewComment('');

    // Kirim notifikasi ke pemilik buletin (jika bukan komentator sendiri)
    if (buletin.userId !== user.uid) {
      const notifRef = doc(collection(db, 'users', buletin.userId, 'notifications'));
      await setDoc(notifRef, {
        fromUser: user.displayName || 'Anonim',
        buletinId: buletin.id,
        buletinTitle: buletin.title,
        isRead: false,
        createdAt: new Date()
      });
    }
  };


  const handleSubmitReply = async (commentId, replyText) => {
    const commentDoc = doc(db, 'posts', id, 'comments', commentId);
    const reply = {
      id: Date.now().toString(),
      userId: user.uid,
      userName: user.displayName || 'Anonim',
      content: replyText
    };

    await updateDoc(commentDoc, {
      replies: arrayUnion(reply)
    });

    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, replies: [...(comment.replies || []), reply] }
          : comment
      )
    );
  };

  if (loading) return <p className="text-center mt-10">Loading detail...</p>;
  if (!buletin) return <p className="text-center mt-10">Buletin tidak ditemukan.</p>;

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <button className="text-blue-600 hover:underline mb-4" onClick={() => navigate(-1)}>
          ← Kembali
        </button>

        <BuletinContent buletin={buletin} />

        {/* Tautan ke profil penulis */}
        <div className="my-4">
          <span className="text-gray-600 text-sm">Ditulis oleh: </span>
          <Link
            to={`/profile/${buletin.userId}`}
            className="text-blue-600 hover:underline text-sm"
          >
            {buletin.userName || 'Penulis'}
          </Link>
        </div>


        <BuletinContent buletin={buletin} />
        <LikeButton
          liked={liked}
          likeCount={likeCount}
          onToggle={handleToggleLike}
        />
        <BookmarkButton
          bookmarked={bookmarked}
          onToggle={handleToggleBookmark}
        />

        <CommentSection
          comments={comments}
          newComment={newComment}
          setNewComment={setNewComment}
          onSubmitComment={handleSubmitComment}
          onSubmitReply={handleSubmitReply}
        />
      </div>
    </div>
  );
}

export default BuletinDetail;
