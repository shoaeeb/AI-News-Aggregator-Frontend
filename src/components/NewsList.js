import React from "react";
import NewsCard from "./NewsCard";

const NewsList = ({ articles }) => {
  return (
    <div>
      {articles.map((article) => (
        <NewsCard key={article._id} article={article} />
      ))}
    </div>
  );
};

export default NewsList;
