import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Assuming shadcn/ui

const NewsCard = ({ article }) => {
  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>
          <Link to={`/news/${article._id}`} className="hover:underline">
            {article.title}
          </Link>
        </CardTitle>
        <CardDescription>{article.publishedAt}</CardDescription>
      </CardHeader>
      {article.image && ( //  Check if there's an image
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      <CardContent>
        <p className="text-gray-700">{article.description}</p>
        <p className="text-sm text-gray-500 mt-2">
          Category: {article.category}
        </p>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
