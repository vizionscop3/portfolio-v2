// Type definitions for the portfolio
export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  category: string;
  tags: string[];
  featured: boolean;
  slug: string;
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  search?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface PortfolioData {
  personalInfo: {
    name: string;
    title: string;
    bio: string;
    avatar: string;
    skills: string[];
    interests: string[];
  };
  projects: Project[];
  blogCategories: BlogCategory[];
  socialLinks: SocialLink[];
}

export type SectionId = 'about' | 'tech' | 'blog' | 'fashion' | 'merch';

export interface FashionItem {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  tags: string[];
  year: string;
  featured: boolean;
}

export interface FashionCollection {
  id: string;
  title: string;
  description: string;
  items: FashionItem[];
  featured: boolean;
}

export interface MerchProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  imageUrl: string;
  images: string[];
  tags: string[];
  inStock: boolean;
  stock?: number;
  sizes?: string[];
  colors?: string[];
  featured: boolean;
  specifications?: Record<string, string>;
  slug: string;
}

export interface CartItem {
  product: MerchProduct;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: ShippingAddress;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  trackingNumber?: string;
}

export interface ErrorInfo {
  message: string;
  stack?: string;
  timestamp: number;
  userAgent: string;
  url: string;
}
