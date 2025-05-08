// src/components/CommentSection.jsx
import React, { useState } from 'react';

// Komponen Balasan
function ReplyForm({ onSubmit }) {
    const [replyText, setReplyText] = useState('');
    const [comments, setComments] = useState([]); // ✅ bukan undefined


    const handleSubmit = () => {
        if (replyText.trim()) {
            onSubmit(replyText);
            setReplyText('');
        }
    };

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
                onClick={handleSubmit}
            >
                Kirim Balasan
            </button>
        </div>
    );
}

function CommentSection({ comments, newComment, setNewComment, onSubmitComment, onSubmitReply }) {
    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Komentar</h3>

            <textarea
                className="w-full border p-2 rounded"
                rows="3"
                placeholder="Tulis komentar..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
            />
            <button
                onClick={onSubmitComment}
                className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
                Kirim
            </button>

            <div className="mt-4 space-y-4">
            {comments?.map((comment) => (
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
                            <ReplyForm onSubmit={(text) => onSubmitReply(comment.id, text)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CommentSection;
