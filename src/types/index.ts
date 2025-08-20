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

export interface ErrorInfo {
  message: string;
  stack?: string;
  timestamp: number;
  userAgent: string;
  url: string;
}

// Re-export 3D scene types
export * from './interactive';
export * from './performance';
export * from './scene';
