import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Reply, Loader2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

function ReplyForm({ onSubmit, isSubmitting }) {
  const [reply, setReply] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reply.trim()) {
      onSubmit(reply);
      setReply('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 pl-4 border-l-2 border-gray-200">
      <div className="flex gap-2">
        <input
          type="text"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Tulis balasan..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={!reply.trim() || isSubmitting}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
          aria-label="Kirim balasan"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
        </button>
      </div>
    </form>
  );
}

function CommentSection({
  comments = [],
  newComment,
  setNewComment,
  onSubmitComment,
  onSubmitReply,
  isSubmittingComment,
  isSubmittingReply
}) {
  const [userProfiles, setUserProfiles] = useState({});
  const [loadingProfiles, setLoadingProfiles] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  const fetchUserProfile = async (userId) => {
    if (userProfiles[userId] || loadingProfiles[userId]) return;

    setLoadingProfiles(prev => ({ ...prev, [userId]: true }));
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserProfiles(prev => ({
          ...prev,
          [userId]: {
            name: userSnap.data().displayName || userSnap.data().name || 'Anonymous',
            avatarUrl: userSnap.data().photoURL || userSnap.data().avatarUrl || null
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoadingProfiles(prev => ({ ...prev, [userId]: false }));
    }
  };

  const totalComments = comments.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0);
  }, 0);

  const toggleCommentExpansion = (commentId) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  useEffect(() => {
    const initialExpanded = {};
    comments.forEach(comment => {
      if (comment.replies?.length > 0) {
        initialExpanded[comment.id] = true;
      }
    });
    setExpandedComments(initialExpanded);
  }, [comments]);

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="text-blue-600" size={20} />
        <h3 className="text-xl font-semibold text-gray-800">
          Diskusi ({totalComments})
        </h3>
      </div>

      {/* New Comment Form */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Bagikan pemikiran Anda..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          rows={3}
          disabled={isSubmittingComment}
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={onSubmitComment}
            disabled={!newComment.trim() || isSubmittingComment}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmittingComment ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Mengirim...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Kirim Komentar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-200">
            Belum ada komentar. Jadilah yang pertama berkomentar!
          </div>
        ) : (
          comments.map((comment) => {
            if (!userProfiles[comment.userId] && !loadingProfiles[comment.userId]) {
              fetchUserProfile(comment.userId);
            }

            const userProfile = userProfiles[comment.userId];
            const isLoadingProfile = loadingProfiles[comment.userId];
            const hasReplies = comment.replies?.length > 0;
            const isExpanded = expandedComments[comment.id];

            return (
              <div key={comment.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                {/* Comment Header */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {isLoadingProfile ? (
                      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                    ) : (
                      <img
                        src={userProfile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.name || 'U')}&background=random`}
                        alt={userProfile?.name || 'User'}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.name || 'U')}&background=random`;
                        }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-gray-800 truncate">
                        {isLoadingProfile ? 'Memuat...' : userProfile?.name || 'Anonymous'}
                      </h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(comment.createdAt?.toDate?.() || comment.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-700 whitespace-pre-line">{comment.content}</p>
                  </div>
                </div>

                {/* Replies Section */}
                {hasReplies && (
                  <div className="mt-3">
                    <button
                      onClick={() => toggleCommentExpansion(comment.id)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Reply size={14} />
                      <span>
                        {isExpanded ? 'Sembunyikan balasan' : `Lihat ${comment.replies.length} balasan`}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="ml-10 mt-3 space-y-3 animate-fade-in">
                        {comment.replies.map((reply) => {
                          if (!userProfiles[reply.userId] && !loadingProfiles[reply.userId]) {
                            fetchUserProfile(reply.userId);
                          }

                          const replyUserProfile = userProfiles[reply.userId];
                          const isLoadingReplyProfile = loadingProfiles[reply.userId];

                          return (
                            <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                  {isLoadingReplyProfile ? (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                                  ) : (
                                    <img
                                      src={replyUserProfile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(replyUserProfile?.name || 'U')}&background=random`}
                                      alt={replyUserProfile?.name || 'User'}
                                      className="w-8 h-8 rounded-full object-cover"
                                      onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(replyUserProfile?.name || 'U')}&background=random`;
                                      }}
                                    />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h5 className="font-medium text-gray-800 text-sm truncate">
                                      {isLoadingReplyProfile ? 'Memuat...' : replyUserProfile?.name || 'Anonymous'}
                                    </h5>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                      {new Date(reply.createdAt?.toDate?.() || reply.createdAt).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{reply.content}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Reply Form */}
                <div className="mt-3">
                  <ReplyForm
                    onSubmit={(text) => onSubmitReply(comment.id, text)}
                    isSubmitting={isSubmittingReply === comment.id}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default CommentSection;