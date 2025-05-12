import { useNavigate, Link } from 'react-router-dom';
import { useBuletinDetail } from '../hooks/useBuletinDetail';
import BuletinContent from '../components/BuletinContent';
import LikeButton from '../components/LikeButton';
import BookmarkButton from '../components/BookmarkButton';
import CommentSection from '../components/CommentSection';
import BackButton from '../components/BackButton';
import { toast } from 'react-hot-toast';
import { CheckCircle, Share2, ArrowLeft, Clock, User, Tag } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function BuletinDetail() {
  const navigate = useNavigate();

  const {
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
    handleSubmitReply,
    handleDeleteComment,
  } = useBuletinDetail();

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: buletin?.title || 'Buletin',
          text: buletin?.subtitle || 'Lihat buletin ini',
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link berhasil disalin!', {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          position: 'bottom-center',
          style: {
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    } catch (err) {
      toast.error('Gagal membagikan', {
        position: 'bottom-center',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton height={40} width={150} />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Skeleton height={40} className="mb-4" />
            <Skeleton count={3} className="mb-2" />
            <Skeleton height={200} className="mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!buletin) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Buletin Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">Buletin yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-10 py-8">
        {/* Back Button */}
        <div className="mb-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Kembali</span>
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Article Content */}
          <div className="px-0 md:px-0">
            <BuletinContent buletin={buletin} />
          </div>


          {/* Author and Metadata */}
          <div className="px-6 pb-6 border-t border-gray-100">
            <div className="flex items-start gap-4">
              <Link
                to={`/profile/${buletin.userId}`}
                className="flex-shrink-0 hover:opacity-90 transition"
              >
                <img
                  src={
                    buletin.buletinProfileImage ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(buletin.buletinName || 'B')}&background=random`
                  }
                  alt={buletin.buletinName}
                  className="w-14 h-14 rounded-full border-2 border-blue-100 object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(buletin.buletinName || 'B')}&background=random`;
                  }}
                />
              </Link>
              <div>
                <h2 className="text-lg font-bold text-gray-800">{buletin.buletinName}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  Ditulis oleh{' '}
                  <Link
                    to={`/profile/${buletin.userId}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {buletin.userName || 'Penulis'}
                  </Link>
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(
                        buletin.createdAt?.toDate?.() || buletin.createdAt
                      ).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {buletin.category && (
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      <span className="capitalize">{buletin.category}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <LikeButton liked={liked} likeCount={likeCount} onToggle={handleToggleLike} />
                <BookmarkButton bookmarked={bookmarked} onToggle={handleToggleBookmark} />
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition shadow-sm"
              >
                <Share2 className="w-5 h-5" />
                <span>Bagikan</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-6 border-t border-gray-100 bg-white">
            <CommentSection
              comments={comments}
              newComment={newComment}
              setNewComment={setNewComment}
              onSubmitComment={handleSubmitComment}
              onSubmitReply={handleSubmitReply}
              onDeleteComment={handleDeleteComment}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuletinDetail;