import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Assuming shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const NewsDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = "http://localhost:5000"; //  your backend URL

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/news/${id}`);
        setArticle(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch article");
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/news/${id}/comments`
        );
        setComments(response.data);
      } catch (err) {
        console.error("Failed to fetch comments", err);
      }
    };

    fetchArticle();
    fetchComments();
  }, [id, backendUrl]);

  const handleCommentSubmit = async () => {
    try {
      const token = localStorage.getItem("token"); //  get the token
      if (!token) {
        toast.error("Please log in to post a comment.");
        return;
      }

      if (!commentText.trim()) {
        toast.error("Comment cannot be empty.");
        return;
      }
      const response = await axios.post(
        `${backendUrl}/api/news/${id}/comments`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`, //  include the token
          },
        }
      );
      setComments([...comments, response.data]);
      setCommentText(""); // Clear the input
      toast.success("Comment posted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to post comment.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!article) {
    return <div>Article not found.</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{article.title}</CardTitle>
          <CardDescription>{article.publishedAt}</CardDescription>
        </CardHeader>
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
        )}
        <CardContent>
          <p className="text-gray-700">{article.content}</p>
          <p className="text-sm text-gray-500 mt-4">
            Category: {article.category}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        {comments.map((comment) => (
          <Card key={comment._id} className="mb-2">
            <CardHeader>
              <CardTitle>{comment.user.name}</CardTitle>
              <CardDescription>{comment.createdAt}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{comment.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <Textarea
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleCommentSubmit}>Post Comment</Button>
      </div>
    </div>
  );
};

export default NewsDetail;
