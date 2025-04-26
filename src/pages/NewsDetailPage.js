import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import "./NewsDetailPage.css";

const NewsDetailPage = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:5000/api";

  console.log(user);
  const fetchNewsItem = async (newsId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/news/${newsId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch news item: ${response.status}`);
      }
      const data = await response.json();
      setNewsItem(data);

      const commentsResponse = await fetch(
        `${API_BASE_URL}/news/${newsId}/comments`
      );
      if (!commentsResponse.ok) {
        throw new Error(`Failed to fetch comments: ${commentsResponse.status}`);
      }
      const commentsData = await commentsResponse.json();
      setComments(commentsData);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to load news details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsItem(id);
  }, [id]);

  const handleAddComment = async () => {
    if (!user) {
      toast.error("Please log in to add a comment.");
      navigate("/login");
      return;
    }
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const addedComment = await response.json();
      setComments([...comments, addedComment]);
      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  if (loading) return <div>Loading news detail...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!newsItem) return <div>News item not found.</div>;

  return (
    <div className="news-detail-page">
      <h1 className="news-title">{newsItem.title}</h1>
      <p className="news-author">By: {newsItem.author}</p>
      <p className="news-content">{newsItem.content}</p>

      {/* Read More Button */}
      {newsItem.url && (
        <a
          href={newsItem.url}
          target="_blank"
          rel="noopener noreferrer"
          className="read-more-button"
        >
          Read More at Source
        </a>
      )}

      <div className="comments-section">
        <h2>Comments</h2>
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p className="comment-text">{comment.text}</p>
            <p className="comment-user">
              By: {comment.user.name || comment.user.userName || "Unknown User"}
            </p>
          </div>
        ))}

        {user ? (
          <div className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
            />
            <button onClick={handleAddComment}>Add Comment</button>
          </div>
        ) : (
          <p>
            Please <Link to="/login">login</Link> to add a comment.
          </p>
        )}
      </div>
    </div>
  );
};

export default NewsDetailPage;
