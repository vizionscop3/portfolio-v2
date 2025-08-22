import { Calendar, Clock, Tag, User } from 'lucide-react';
import React from 'react';
import { BlogPost } from '../../types';
import { formatDate } from '../../utils/blogData';

interface BlogPostCardProps {
  post: BlogPost;
  onClick: (post: BlogPost) => void;
  featured?: boolean;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  onClick,
  featured = false,
}) => {
  const handleClick = () => {
    onClick(post);
  };

  return (
    <article
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group ${
        featured ? 'border-l-4 border-blue-500' : ''
      }`}
      onClick={handleClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3
              className={`font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 ${
                featured ? 'text-xl' : 'text-lg'
              }`}
            >
              {post.title}
            </h3>
            {featured && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">
                Featured
              </span>
            )}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
              post.category
            )}`}
          >
            {post.category}
          </span>
        </div>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{post.readingTime} min read</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

// Helper function to get category colors
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Tech: 'bg-blue-100 text-blue-800',
    Music: 'bg-purple-100 text-purple-800',
    Fashion: 'bg-pink-100 text-pink-800',
    Business: 'bg-green-100 text-green-800',
    Art: 'bg-orange-100 text-orange-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};
