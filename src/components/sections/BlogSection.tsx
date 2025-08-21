import { Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BlogFilters, BlogPost } from '../../types';
import { blogCategories, getAllTags } from '../../utils/blogData';
import { BlogService } from '../../utils/blogService';
import { BlogPostCard } from '../blog/BlogPostCard';
import { BlogPostDetail } from '../blog/BlogPostDetail';

export const BlogSection: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filters, setFilters] = useState<BlogFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  const blogService = BlogService.getInstance();
  const allTags = getAllTags();

  // Load posts based on current filters
  useEffect(() => {
    const filteredPosts = blogService.getPosts(filters);
    setPosts(filteredPosts);
  }, [filters]);

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilters(prev => ({ ...prev, search: term || undefined }));
  };

  // Handle category filter
  const handleCategoryFilter = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: category === 'all' ? undefined : category,
    }));
  };

  // Handle tag filter
  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    setFilters(prev => ({ ...prev, tag: tag || undefined }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setSelectedTag('');
  };

  // Handle post selection
  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
  };

  // Handle back to blog list
  const handleBackToBlog = () => {
    setSelectedPost(null);
  };

  // Get featured posts
  const featuredPosts = blogService.getFeaturedPosts();

  if (selectedPost) {
    return (
      <BlogPostDetail
        post={selectedPost}
        onBack={handleBackToBlog}
        onPostClick={handlePostClick}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Creative Blog</h2>
        <p className="text-gray-600 mb-8">
          Exploring the intersection of technology, creativity, and innovation
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filters */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {blogCategories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filters.category === category.id ||
                  (!filters.category && category.id === 'all')
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Tag Filters */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 10).map(tag => (
              <button
                key={tag}
                onClick={() => handleTagFilter(selectedTag === tag ? '' : tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTag === tag
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {(filters.search || filters.category || filters.tag) && (
          <div className="flex items-center gap-2 pt-4 border-t">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Search: "{filters.search}"
                <button onClick={() => handleSearch('')}>
                  <X size={14} />
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Category: {filters.category}
                <button onClick={() => handleCategoryFilter('all')}>
                  <X size={14} />
                </button>
              </span>
            )}
            {filters.tag && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                Tag: #{filters.tag}
                <button onClick={() => handleTagFilter('')}>
                  <X size={14} />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 &&
        !filters.search &&
        !filters.category &&
        !filters.tag && (
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Featured Posts
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {featuredPosts.map(post => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  onClick={handlePostClick}
                  featured={true}
                />
              ))}
            </div>
          </section>
        )}

      {/* Blog Posts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {filters.search || filters.category || filters.tag
              ? 'Search Results'
              : 'All Posts'}
          </h3>
          <span className="text-sm text-gray-600">
            {posts.length} post{posts.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <BlogPostCard
                key={post.id}
                post={post}
                onClick={handlePostClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              No posts found matching your criteria.
            </p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Clear filters to see all posts
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
