import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

const UserPublicProfile = () => {
  const { userId } = useParams(); // ambil dari URL misalnya /profile/:userId
  const currentUserId = localStorage.getItem('userId');

  const [profile, setProfile] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, 'users', userId));
      if (snap.exists()) setProfile(snap.data());

      // cek apakah user sudah subscribe
      const subRef = doc(db, 'users', userId, 'subscribers', currentUserId);
      const subSnap = await getDoc(subRef);
      setIsSubscribed(subSnap.exists());
    };

    fetchProfile();
  }, [userId, currentUserId]);

  const handleSubscribe = async () => {
    const subRef = doc(db, 'users', userId, 'subscribers', currentUserId);
    const mySubRef = doc(db, 'users', currentUserId, 'subscriptions', userId);

    if (isSubscribed) {
      await deleteDoc(subRef);
      await deleteDoc(mySubRef);
      setIsSubscribed(false);
    } else {
      await setDoc(subRef, { createdAt: Date.now() });
      await setDoc(mySubRef, { createdAt: Date.now() });
      setIsSubscribed(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 mt-10 bg-white shadow rounded">
      {profile ? (
        <>
          <h2 className="text-xl font-bold">{profile.name}</h2>
          {profile.avatarUrl && (
            <img src={profile.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full my-4" />
          )}
          <p className="text-gray-600">{profile.about}</p>
          <p className="text-blue-500"><a href={profile.socialUrl}>{profile.socialUrl}</a></p>

          <button
            onClick={handleSubscribe}
            className={`mt-4 px-4 py-2 rounded ${isSubscribed ? 'bg-gray-500' : 'bg-green-600'} text-white`}
          >
            {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
          </button>
        </>
      ) : (
        <p>Memuat...</p>
      )}
    </div>
  );
};

export default UserPublicProfile;
