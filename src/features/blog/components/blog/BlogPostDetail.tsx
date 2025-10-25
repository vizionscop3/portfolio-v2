import { ArrowLeft, Calendar, Clock, Share2, Tag, User } from 'lucide-react';
import React from 'react';
import { BlogPost } from '../../../../shared/types';
import { formatDate } from '../../../../shared/utils/blogData';
import { BlogService } from '../../../../shared/utils/blogService';
import { BlogPostCard } from './BlogPostCard';
import { MarkdownRenderer } from './MarkdownRenderer';

interface BlogPostDetailProps {
  post: BlogPost;
  onBack: () => void;
  onPostClick: (post: BlogPost) => void;
}

export const BlogPostDetail: React.FC<BlogPostDetailProps> = ({
  post,
  onBack,
  onPostClick,
}) => {
  const blogService = BlogService.getInstance();
  const relatedPosts = blogService.getRelatedPosts(post, 3);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
      >
        <ArrowLeft size={20} />
        Back to Blog
      </button>

      {/* Article header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
              post.category
            )}`}
          >
            {post.category}
          </span>
          {post.featured && (
            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-6">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{post.readingTime} min read</span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Share2 size={16} />
            Share
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              <Tag size={12} />
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Article content */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
        <MarkdownRenderer
          content={post.content}
          className="prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
        />
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Posts
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map(relatedPost => (
              <BlogPostCard
                key={relatedPost.id}
                post={relatedPost}
                onClick={onPostClick}
              />
            ))}
          </div>
        </section>
      )}
    </div>
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
