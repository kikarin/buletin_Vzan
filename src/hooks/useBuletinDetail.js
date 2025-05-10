import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  doc, getDoc, updateDoc, arrayUnion, collection, addDoc, getDocs, deleteDoc, setDoc
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';

export const useBuletinDetail = () => {
  const { id } = useParams();
  const auth = getAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buletin, setBuletin] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

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
    const userBookmarkRef = doc(db, 'users', user.uid, 'bookmarks', id);

    const updatedBookmarks = bookmarked
      ? buletin.bookmarks.filter(uid => uid !== user.uid)
      : [...(buletin.bookmarks || []), user.uid];

    try {
      await updateDoc(postRef, { bookmarks: updatedBookmarks });

      if (bookmarked) {
        await deleteDoc(userBookmarkRef);
      } else {
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

  return {
    loading,
    buletin,
    liked,
    likeCount,
    bookmarked,
    comments,
    newComment,
    setNewComment,
    handleToggleLike,
    handleToggleBookmark,
    handleSubmitComment,
    handleSubmitReply
  };
};
