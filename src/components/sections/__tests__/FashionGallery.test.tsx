import { FashionItem } from '@/types';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FashionGallery } from '../FashionGallery';

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

const mockItems: FashionItem[] = [
  {
    id: 'test-item-1',
    name: 'Test Fashion Item',
    description: 'A test fashion item for testing purposes',
    category: 'Test Category',
    imageUrl: 'https://example.com/test-image.jpg',
    tags: ['test', 'fashion', 'item'],
    year: '2024',
    featured: true,
  },
  {
    id: 'test-item-2',
    name: 'Another Test Item',
    description: 'Another test fashion item',
    category: 'Another Category',
    imageUrl: 'https://example.com/test-image-2.jpg',
    tags: ['another', 'test'],
    year: '2023',
    featured: false,
  },
];

describe('FashionGallery', () => {
  it('renders fashion items correctly', () => {
    render(<FashionGallery items={mockItems} />);

    expect(screen.getByText('Test Fashion Item')).toBeInTheDocument();
    expect(screen.getByText('Another Test Item')).toBeInTheDocument();
  });

  it('displays item information correctly', () => {
    render(<FashionGallery items={mockItems} />);

    // Check descriptions
    expect(
      screen.getByText('A test fashion item for testing purposes')
    ).toBeInTheDocument();
    expect(screen.getByText('Another test fashion item')).toBeInTheDocument();

    // Check categories
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('Another Category')).toBeInTheDocument();

    // Check years
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('shows featured badge for featured items', () => {
    render(<FashionGallery items={mockItems} />);

    // Should show FEATURED badge for the first item only
    const featuredBadges = screen.getAllByText('FEATURED');
    expect(featuredBadges).toHaveLength(1);
  });

  it('displays item tags', () => {
    render(<FashionGallery items={mockItems} />);

    expect(screen.getAllByText('test')).toHaveLength(2); // 'test' appears in both items
    expect(screen.getByText('fashion')).toBeInTheDocument();
    expect(screen.getByText('item')).toBeInTheDocument();
    expect(screen.getByText('another')).toBeInTheDocument();
  });

  it('calls onItemSelect when item is clicked', () => {
    const mockOnItemSelect = vi.fn();
    render(
      <FashionGallery items={mockItems} onItemSelect={mockOnItemSelect} />
    );

    fireEvent.click(screen.getByText('Test Fashion Item'));

    expect(mockOnItemSelect).toHaveBeenCalledWith(mockItems[0]);
  });

  it('opens modal when item is clicked', async () => {
    render(<FashionGallery items={mockItems} />);

    fireEvent.click(screen.getByText('Test Fashion Item'));

    await waitFor(() => {
      // Modal should be open and show item details
      expect(
        screen.getByText('Click to zoom • ESC to close')
      ).toBeInTheDocument();
    });
  });

  it('closes modal when close button is clicked', async () => {
    render(<FashionGallery items={mockItems} />);

    // Open modal
    fireEvent.click(screen.getByText('Test Fashion Item'));

    await waitFor(() => {
      expect(
        screen.getByText('Click to zoom • ESC to close')
      ).toBeInTheDocument();
    });

    // Close modal
    const closeButton = screen.getByTitle('Close');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByText('Click to zoom • ESC to close')
      ).not.toBeInTheDocument();
    });
  });

  it('handles empty items array', () => {
    render(<FashionGallery items={[]} />);

    // Should not crash and should not display any items
    expect(screen.queryByText('Test Fashion Item')).not.toBeInTheDocument();
  });
});
