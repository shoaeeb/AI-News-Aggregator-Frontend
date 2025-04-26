import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./HomePage.css"; // Create this CSS file

const HomePage = () => {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api"; // Define base URL

  //  API function
  const fetchNews = async (category) => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_BASE_URL}/news`;
      if (category) {
        url += `?category=${category}`; // Use the provided route
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`);
      }
      const data = await response.json();
      setNews(data);

      // Fetch categories (assuming they are included in the news data)
      // If categories are from a different endpoint, you'd fetch them separately
      if (data && data.length > 0) {
        const uniqueCategories = [
          ...new Set(data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to load news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  if (loading) {
    return <div>Loading news...</div>; // Simple loading indicator
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="home-page">
      <div className="category-filter">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="news-list">
        {news.length === 0 ? (
          <div>No news found for this category.</div>
        ) : (
          news.map((item) => (
            <div key={item._id} className="news-card">
              <Link to={`/news/${item._id}`} className="news-link">
                <h2 className="news-title">{item.title}</h2>
                <p className="news-summary">{item.summary}</p>
                <p className="news-category">Category: {item.category}</p>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
