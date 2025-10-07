import { BlogFilters, BlogPost } from '../types';
import { blogPosts } from './blogData';

export class BlogService {
  private static instance: BlogService;
  private posts: BlogPost[] = blogPosts;

  static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  // Get all posts with optional filtering
  getPosts(filters?: BlogFilters): BlogPost[] {
    let filteredPosts = [...this.posts];

    // Filter by category
    if (filters?.category && filters.category !== 'all') {
      filteredPosts = filteredPosts.filter(
        post => post.category.toLowerCase() === filters.category?.toLowerCase()
      );
    }

    // Filter by tag
    if (filters?.tag) {
      filteredPosts = filteredPosts.filter(post =>
        post.tags.some(tag =>
          tag.toLowerCase().includes(filters.tag?.toLowerCase() || '')
        )
      );
    }

    // Filter by search term
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredPosts = filteredPosts.filter(
        post =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Sort by publication date (newest first)
    return filteredPosts.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  // Get featured posts
  getFeaturedPosts(): BlogPost[] {
    return this.posts
      .filter(post => post.featured)
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  }

  // Get post by slug
  getPostBySlug(slug: string): BlogPost | undefined {
    return this.posts.find(post => post.slug === slug);
  }

  // Get related posts (same category, excluding current post)
  getRelatedPosts(currentPost: BlogPost, limit: number = 3): BlogPost[] {
    return this.posts
      .filter(
        post =>
          post.id !== currentPost.id && post.category === currentPost.category
      )
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      .slice(0, limit);
  }

  // Get posts by category
  getPostsByCategory(category: string): BlogPost[] {
    if (category === 'all') {
      return this.getPosts();
    }
    return this.posts.filter(
      post => post.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Search posts
  searchPosts(query: string): BlogPost[] {
    return this.getPosts({ search: query });
  }

  // Get recent posts
  getRecentPosts(limit: number = 5): BlogPost[] {
    return this.posts
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      .slice(0, limit);
  }
}
