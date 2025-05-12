import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../services/firebase";
import {
  Heart,
  FileText,
  Bookmark,
  Users,
  X,
  Eye,
  Bell,
  Mail,
  Globe,
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";
import ImageModal from "../components/ImageModal";

const UserPublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  const defaultAvatar =
    "https://ui-avatars.com/api/?name=User&background=random&size=256";
  const [profile, setProfile] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLikes: 0,
    totalPosts: 0,
    totalBookmarks: 0,
    totalSubscribers: 0,
    totalViews: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userSnap, subSnap, postSnap, subCountSnap] = await Promise.all([
          getDoc(doc(db, "users", userId)),
          getDoc(doc(db, "users", userId, "subscribers", currentUserId)),
          getDocs(
            query(collection(db, "posts"), where("userId", "==", userId))
          ),
          getDocs(collection(db, "users", userId, "subscribers")),
        ]);

        if (userSnap.exists()) {
          setProfile(userSnap.data());
        }

        setIsSubscribed(subSnap.exists());

        let totalLikes = 0;
        let totalBookmarks = 0;
        postSnap.forEach((doc) => {
          const data = doc.data();
          totalLikes += data.likes?.length || 0;
          totalBookmarks += data.bookmarks?.length || 0;
        });

        if (userId !== currentUserId) {
          await updateDoc(doc(db, "users", userId), {
            totalViews: increment(1),
          });
        }

        setStats({
          totalLikes,
          totalBookmarks,
          totalPosts: postSnap.size,
          totalSubscribers: subCountSnap.size,
          totalViews:
            (userSnap.data()?.totalViews || 0) +
            (userId !== currentUserId ? 1 : 0),
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    if (userId && currentUserId) {
      fetchData();
    }
  }, [userId, currentUserId]);

  const handleSubscribe = async () => {
    try {
      const subRef = doc(db, "users", userId, "subscribers", currentUserId);
      const mySubRef = doc(db, "users", currentUserId, "subscriptions", userId);

      if (isSubscribed) {
        await Promise.all([deleteDoc(subRef), deleteDoc(mySubRef)]);
        setIsSubscribed(false);
        setStats((prev) => ({
          ...prev,
          totalSubscribers: prev.totalSubscribers - 1,
        }));
        toast.success("Unsubscribed successfully");
      } else {
        await Promise.all([
          setDoc(subRef, { createdAt: Date.now() }),
          setDoc(mySubRef, { createdAt: Date.now() }),
        ]);
        setIsSubscribed(true);
        setStats((prev) => ({
          ...prev,
          totalSubscribers: prev.totalSubscribers + 1,
        }));
        toast.success("Subscribed successfully");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to update subscription");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md bg-white rounded-xl shadow-md">
          <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The user profile you're looking for doesn't exist or may have been
            removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with back button */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Profil Pengguna</h1>
            <div className="w-8"></div>
          </div>

          {/* Profile Content */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => setShowAvatarModal(true)}
                >
                  <img
                    src={profile?.avatarUrl || defaultAvatar}
                    alt="Avatar"
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>

                <button
                  onClick={handleSubscribe}
                  className={`mt-6 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 shadow-md ${
                    isSubscribed
                      ? "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                  }`}
                >
                  <Bell
                    className={`w-5 h-5 ${
                      isSubscribed ? "text-gray-600" : "text-white"
                    }`}
                  />
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-grow">
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {profile.name}
                  </h2>
                  {profile.username && (
                    <p className="text-blue-600 font-medium">
                      @{profile.username}
                    </p>
                  )}
                </div>

                {profile.about && (
                  <div className="mb-6">
                    <p className="text-xl text-gray-700 whitespace-pre-line">
                      {profile.about}
                    </p>
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-2">
                  {profile.email && (
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-5 h-5 mr-2 text-blue-500" />
                      <a
                        href={`mailto:${profile.email}`}
                        className="hover:underline"
                      >
                        {profile.email}
                      </a>
                    </div>
                  )}
                  {profile.socialUrl && (
                    <div className="flex items-center text-gray-600">
                      <Globe className="w-5 h-5 mr-2 text-blue-500" />
                      <a
                        href={profile.socialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline truncate"
                      >
                        {profile.socialUrl.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-5 gap-4">
              <StatCard
                icon={<Heart className="w-6 h-6" />}
                value={stats.totalLikes}
                label="Disukai"
                color="text-red-500"
                bgColor="bg-red-50"
              />
              <StatCard
                icon={<FileText className="w-6 h-6" />}
                value={stats.totalPosts}
                label="Jumlah Postingan"
                color="text-blue-500"
                bgColor="bg-blue-50"
              />
              <StatCard
                icon={<Bookmark className="w-6 h-6" />}
                value={stats.totalBookmarks}
                label="Tesimpan"
                color="text-purple-500"
                bgColor="bg-purple-50"
              />
              <StatCard
                icon={<Users className="w-6 h-6" />}
                value={stats.totalSubscribers}
                label="Subscribers"
                color="text-green-500"
                bgColor="bg-green-50"
              />
              <StatCard
                icon={<Eye className="w-6 h-6" />}
                value={stats.totalViews}
                label="Dilihat"
                color="text-amber-500"
                bgColor="bg-amber-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Modal */}
      <ImageModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        imageUrl={profile?.avatarUrl || defaultAvatar}
        altText="Avatar Pengguna"
      />
    </div>
  );
};

const StatCard = ({ icon, value, label, color, bgColor }) => (
  <div
    className={`${bgColor} p-4 rounded-xl flex flex-col items-center transition-all hover:shadow-md`}
  >
    <div className={`p-3 rounded-full ${bgColor} mb-2`}>
      <div className={color}>{icon}</div>
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);

export default UserPublicProfile;
