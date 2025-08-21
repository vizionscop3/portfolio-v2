import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FashionSection } from '../FashionSection';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    img: ({ children, ...props }: any) => <img {...props}>{children}</img>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('FashionSection', () => {
  it('renders the fashion section with title and description', () => {
    render(<FashionSection />);

    expect(screen.getByText('Fashion Forward')).toBeInTheDocument();
    expect(
      screen.getByText(/Where technology meets style/)
    ).toBeInTheDocument();
  });

  it('displays collection filter buttons', () => {
    render(<FashionSection />);

    expect(screen.getByText('ALL COLLECTIONS')).toBeInTheDocument();
    expect(screen.getByText('CYBERPUNK ESSENTIALS')).toBeInTheDocument();
    expect(screen.getByText('NEON NIGHTS')).toBeInTheDocument();
    expect(screen.getByText('TECH WEAR')).toBeInTheDocument();
  });

  it('filters items when collection button is clicked', async () => {
    render(<FashionSection />);

    // Initially shows all items
    expect(screen.getByText('Holographic Jacket')).toBeInTheDocument();
    expect(screen.getByText('Reactive Glow Sneakers')).toBeInTheDocument();

    // Click on Cyberpunk collection
    fireEvent.click(screen.getByText('CYBERPUNK ESSENTIALS'));

    await waitFor(() => {
      expect(screen.getByText('Holographic Jacket')).toBeInTheDocument();
      // Neon Nights items should not be visible
      expect(
        screen.queryByText('Reactive Glow Sneakers')
      ).not.toBeInTheDocument();
    });
  });

  it('displays fashion items with correct information', () => {
    render(<FashionSection />);

    // Check if fashion items are displayed
    expect(screen.getByText('Holographic Jacket')).toBeInTheDocument();
    expect(screen.getByText('LED Strip Hoodie')).toBeInTheDocument();
    expect(screen.getByText('Cyber Goggles')).toBeInTheDocument();

    // Check if categories are displayed
    expect(screen.getByText('Outerwear')).toBeInTheDocument();
    expect(screen.getByText('Streetwear')).toBeInTheDocument();
    expect(screen.getAllByText('Accessories')).toHaveLength(2); // There are 2 items in Accessories category
  });

  it('shows featured badges for featured items', () => {
    render(<FashionSection />);

    // Should have multiple FEATURED badges for featured items
    const featuredBadges = screen.getAllByText('FEATURED');
    expect(featuredBadges.length).toBeGreaterThan(0);
  });

  it('displays item tags', () => {
    render(<FashionSection />);

    expect(screen.getByText('holographic')).toBeInTheDocument();
    expect(screen.getAllByText('LED')).toHaveLength(3); // LED appears in 3 items
    expect(screen.getByText('programmable')).toBeInTheDocument();
  });

  it('shows item years', () => {
    render(<FashionSection />);

    expect(screen.getAllByText('2024')).toHaveLength(4); // 4 instances of 2024 (3 items, one might be duplicated)
    expect(screen.getAllByText('2023')).toHaveLength(2); // 2 items from 2023
  });
});
