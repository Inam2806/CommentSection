// CommentSection.js

import React, { useState } from 'react';
import './style/style.scss';

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');

  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');
  const [replyingToComment, setReplyingToComment] = useState(null);




  const handlePostComment = () => {
    if (!newCommentText) {
      // Do not post empty comments
      return;
    }

    const newComment = {
      id: comments.length + 1,
      text: newCommentText,
      timestamp: Date.now(),
      replies: [],
      isStarred: false,
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
    setReplyingTo(null);
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = comments.filter((comment) => comment.id !== commentId);
    setComments(updatedComments);
  };

  const handleReplyToComment = (parentCommentId) => {
    setReplyingTo(parentCommentId);
  };

  const handlePostReply = (parentCommentId) => {
    if (!replyText) {
      // Do not post empty replies
      return;
    }

    const updatedComments = comments.map((comment) => {
      if (comment.id === parentCommentId) {
        return {
          ...comment,
          replies: [
            ...comment.replies,
            { id: comment.replies.length + 1, text: replyText, timestamp: Date.now(), isStarred: false, replies: [] },
          ],
        };
      } else if (comment.replies && comment.replies.length > 0) {
        return findAndAddReply(comment.replies, parentCommentId, replyText);
      }
      return comment;
    });

    setComments(updatedComments);
    setReplyText('');
    setReplyingTo(null);
  };

  const findAndAddReply = (replies, parentCommentId, replyText) => {
    return replies.map((reply) => {
      if (reply.id === parentCommentId) {
        return {
          ...reply,
          replies: [
            ...reply.replies,
            { id: reply.replies.length + 1, text: replyText, timestamp: Date.now(), isStarred: false, replies: [] },
          ],
        };
      } else if (reply.replies && reply.replies.length > 0) {
        return findAndAddReply(reply.replies, parentCommentId, replyText);
      }
      return reply;
    });
  };

  const handleEditComment = (commentId, commentText) => {
    setEditingComment(commentId);
    setEditedCommentText(commentText);
  };
  
  const handleSaveEditedComment = (commentId) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, text: editedCommentText };
      } else if (comment.replies && comment.replies.length > 0) {
        return findAndSaveEditedComment(comment.replies, commentId);
      }
      return comment;
    });
  
    setComments(updatedComments);
    setEditingComment(null);
    setEditedCommentText('');
  };
  
  const findAndSaveEditedComment = (replies, commentId) => {
    return replies.map((reply) => {
      if (reply.id === commentId) {
        return { ...reply, text: editedCommentText };
      } else if (reply.replies && reply.replies.length > 0) {
        return findAndSaveEditedComment(reply.replies, commentId);
      }
      return reply;
    });
  };
  


  const handleToggleStar = (commentId) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, isStarred: !comment.isStarred };
      } else if (comment.replies && comment.replies.length > 0) {
        return findAndToggleStar(comment.replies, commentId);
      }
      return comment;
    });

    setComments(updatedComments);
  };

  const findAndToggleStar = (replies, commentId) => {
    return replies.map((reply) => {
      if (reply.id === commentId) {
        return { ...reply, isStarred: !reply.isStarred };
      } else if (reply.replies && reply.replies.length > 0) {
        return findAndToggleStar(reply.replies, commentId);
      }
      return reply;
    });
  };

  return (
    <div className="comment-section">
      <h2>Comments</h2>
      <ul>
        {comments
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((comment) => (
            <li key={comment.id}>
              <div className="comment-content">
              <div className="comment-text">
                {comment.id === editingComment ? (
                  <textarea
                    value={editedCommentText}
                    onChange={(e) => setEditedCommentText(e.target.value)}
                  ></textarea>
                ) : (
                  comment.text
                )}
              </div>
                <div className="comment-buttons">
                  <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                  <button onClick={() => handleReplyToComment(comment.id)}>Reply</button>
                  {comment.id === editingComment && !replyingToComment ? (
  <button onClick={() => handleSaveEditedComment(comment.id)}>Save</button>
) : (
  <button onClick={() => handleEditComment(comment.id, comment.text)}>Edit</button>
)}

                  <button className={comment.isStarred ? 'starred' : ''} onClick={() => handleToggleStar(comment.id)}>
                    Star
                  </button>
                </div>
              </div>
              {replyingTo === comment.id && (
                <div>
                  <textarea
                    placeholder="Type your reply"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  ></textarea>
                  <button onClick={() => handlePostReply(comment.id)}>Post Reply</button>
                </div>
              )}
              {comment.replies && comment.replies.length > 0 && (
                <ul>
                  {comment.replies
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((reply) => (
                      <li key={reply.id}>
                        <div className="comment-content">
                          <div className="comment-text">{reply.text}</div>
                          <div className="comment-buttons">
                            <button onClick={() => handleDeleteComment(reply.id)}>Delete</button>
                            <button onClick={() => handleReplyToComment(reply.id)}>Reply</button>
                            {comment.id === editingComment && !replyingToComment ? (
  <button onClick={() => handleSaveEditedComment(comment.id)}>Save</button>
) : (
  <button onClick={() => handleEditComment(comment.id, comment.text)}>Edit</button>
)}


                            <button className={reply.isStarred ? 'starred' : ''} onClick={() => handleToggleStar(reply.id)}>
                              Star
                            </button>
                          </div>
                        </div>
                        {replyingTo === reply.id && (
                          <div>
                            <textarea
                              placeholder="Type your reply"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                            ></textarea>
                            <button onClick={() => handlePostReply(reply.id)}>Post Reply</button>
                          </div>
                        )}
                        {reply.replies && reply.replies.length > 0 && (
                          <ul>
                            {reply.replies
                              .sort((a, b) => b.timestamp - a.timestamp)
                              .map((nestedReply) => (
                                <li key={nestedReply.id}>
                                  <div className="comment-content">
                                    <div className="comment-text">{nestedReply.text}</div>
                                    <div className="comment-buttons">
                                      <button onClick={() => handleDeleteComment(nestedReply.id)}>Delete</button>
                                      <button onClick={() => handleReplyToComment(nestedReply.id)}>Reply</button>
                                      <button onClick={() => handleEditComment(nestedReply.id, nestedReply.text)}>Edit</button>
                                      <button
                                        className={nestedReply.isStarred ? 'starred' : ''}
                                        onClick={() => handleToggleStar(nestedReply.id)}
                                      >
                                        Star
                                      </button>
                                    </div>
                                  </div>
                                  {replyingTo === nestedReply.id && (
                                    <div>
                                      <textarea
                                        placeholder="Type your reply"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                      ></textarea>
                                      <button onClick={() => handlePostReply(nestedReply.id)}>Post Reply</button>
                                    </div>
                                  )}
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    ))}
                </ul>
              )}
            </li>
          ))}
      </ul>
      <textarea
        placeholder="Type your comment"
        value={newCommentText}
        onChange={(e) => setNewCommentText(e.target.value)}
      ></textarea>
      <button onClick={handlePostComment}>Post Comment</button>
    </div>
  );
};

export default CommentSection;
