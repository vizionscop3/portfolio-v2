import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Portfolio from '../src/components/Portfolio';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Github: () => <div data-testid="github-icon" />,
  ExternalLink: () => <div data-testid="external-link-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  Linkedin: () => <div data-testid="linkedin-icon" />,
  Twitter: () => <div data-testid="twitter-icon" />,
  Menu: () => <div data-testid="menu-icon" />,
  X: () => <div data-testid="x-icon" />,
  Code: () => <div data-testid="code-icon" />,
  Palette: () => <div data-testid="palette-icon" />,
  Music: () => <div data-testid="music-icon" />,
  ShoppingBag: () => <div data-testid="shopping-bag-icon" />,
  User: () => <div data-testid="user-icon" />,
  FileText: () => <div data-testid="file-text-icon" />,
}));

describe('Portfolio Component', () => {
  it('renders the portfolio component', () => {
    render(<Portfolio />);
    
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('John Developer')).toBeInTheDocument();
    expect(screen.getByText('Full Stack Developer & Creative')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<Portfolio />);
    
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Fashion')).toBeInTheDocument();
    expect(screen.getByText('Merch')).toBeInTheDocument();
  });

  it('changes sections when navigation items are clicked', () => {
    render(<Portfolio />);
    
    // Initially on About section
    expect(screen.getByText('Technical Skills')).toBeInTheDocument();
    
    // Click on Tech section
    fireEvent.click(screen.getByText('Tech'));
    expect(screen.getByText('Technical Projects')).toBeInTheDocument();
    
    // Click on Blog section
    fireEvent.click(screen.getByText('Blog'));
    expect(screen.getByText('Creative Blog')).toBeInTheDocument();
  });

  it('displays project cards in tech section', () => {
    render(<Portfolio />);
    
    // Navigate to tech section
    fireEvent.click(screen.getByText('Tech'));
    
    expect(screen.getByText('E-Commerce Platform')).toBeInTheDocument();
    expect(screen.getByText('Task Management App')).toBeInTheDocument();
    expect(screen.getByText('Weather Dashboard')).toBeInTheDocument();
  });

  it('renders mobile menu toggle', () => {
    render(<Portfolio />);
    
    const menuButton = screen.getByTestId('menu-icon').parentElement;
    expect(menuButton).toBeInTheDocument();
  });

  it('renders social media links in footer', () => {
    render(<Portfolio />);
    
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
    expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument();
    expect(screen.getByTestId('twitter-icon')).toBeInTheDocument();
    expect(screen.getByTestId('github-icon')).toBeInTheDocument();
  });

  it('displays coming soon messages for incomplete sections', () => {
    render(<Portfolio />);
    
    // Navigate to blog section
    fireEvent.click(screen.getByText('Blog'));
    expect(screen.getByText('Blog Coming Soon')).toBeInTheDocument();
    
    // Navigate to fashion section
    fireEvent.click(screen.getByText('Fashion'));
    expect(screen.getByText('Fashion Portfolio Coming Soon')).toBeInTheDocument();
    
    // Navigate to merch section
    fireEvent.click(screen.getByText('Merch'));
    expect(screen.getByText('Shop Opening Soon')).toBeInTheDocument();
  });
});
