import { useNavigate } from 'react-router-dom';
import { useBuletinDetail } from '../hooks/useBuletinDetail';
import BuletinContent from '../components/BuletinContent';
import LikeButton from '../components/LikeButton';
import BookmarkButton from '../components/BookmarkButton';
import CommentSection from '../components/CommentSection';
import BackButton from '../components/BackButton';
import { Link } from 'react-router-dom';

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
  } = useBuletinDetail();

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: buletin?.title || 'Buletin',
          text: buletin?.subtitle || 'Lihat buletin ini',
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Link berhasil disalin!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (!buletin) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-600">Buletin tidak ditemukan.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b">
            <BackButton onClick={() => navigate(-1)} />
            <div className="mt-4 flex items-center gap-3 mb-4">
              <Link to={`/profile/${buletin.userId}`}>
                <img
                  src={buletin.buletinProfileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(buletin.buletinName || 'B')}`}
                  alt={buletin.buletinName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-100 hover:scale-105 transition"
                />
              </Link>
              <div>
                <h2 className="text-xl font-semibold text-blue-600">{buletin.buletinName}</h2>
                <span className="text-sm text-gray-600">
                  Ditulis oleh: <Link to={`/profile/${buletin.userId}`} className="text-blue-600 hover:underline">{buletin.userName || 'Penulis'}</Link>
                </span>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                  <span>{new Date(buletin.createdAt?.toDate?.() || buletin.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}</span>
                  <span>•</span>
                  <span>{buletin.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <BuletinContent buletin={buletin} />
          </div>

          {/* Actions */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <LikeButton liked={liked} likeCount={likeCount} onToggle={handleToggleLike} />
                <BookmarkButton bookmarked={bookmarked} onToggle={handleToggleBookmark} />
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Bagikan
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="p-6 border-t">
            <CommentSection
              comments={comments}
              newComment={newComment}
              setNewComment={setNewComment}
              onSubmitComment={handleSubmitComment}
              onSubmitReply={handleSubmitReply}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuletinDetail;
