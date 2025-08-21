import { MerchProduct } from '@/types';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProductCard } from '../ProductCard';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    img: ({ children, ...props }: any) => <img {...props}>{children}</img>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ShoppingCart: ({ size, ...props }: any) => (
    <svg data-testid="shopping-cart-icon" {...props}>
      {size}
    </svg>
  ),
  Eye: ({ size, ...props }: any) => (
    <svg data-testid="eye-icon" {...props}>
      {size}
    </svg>
  ),
  Heart: ({ size, fill, ...props }: any) => (
    <svg data-testid="heart-icon" fill={fill} {...props}>
      {size}
    </svg>
  ),
}));

// Mock cart store
vi.mock('@/store/cartStore', () => ({
  useCartStore: () => ({
    addItem: vi.fn(),
    openCart: vi.fn(),
  }),
}));

const mockProduct: MerchProduct = {
  id: 'test-product',
  name: 'Test Product',
  description: 'A test product for testing purposes',
  price: 29.99,
  currency: 'USD',
  category: 'Test Category',
  imageUrl: 'https://example.com/test-image.jpg',
  images: ['https://example.com/test-image.jpg'],
  tags: ['test', 'product', 'sample'],
  inStock: true,
  stock: 10,
  featured: true,
  slug: 'test-product',
};

const mockOutOfStockProduct: MerchProduct = {
  ...mockProduct,
  id: 'out-of-stock-product',
  name: 'Out of Stock Product',
  inStock: false,
  stock: 0,
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(
      screen.getByText('A test product for testing purposes')
    ).toBeInTheDocument();
  });

  it('displays featured badge for featured products', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('FEATURED')).toBeInTheDocument();
  });

  it('displays out of stock badge for unavailable products', () => {
    render(<ProductCard product={mockOutOfStockProduct} />);

    const outOfStockElements = screen.getAllByText('OUT OF STOCK');
    expect(outOfStockElements).toHaveLength(2); // Badge and button text
  });

  it('displays product tags', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('product')).toBeInTheDocument();
    expect(screen.getByText('sample')).toBeInTheDocument();
  });

  it('shows correct button text based on stock status', () => {
    const { rerender } = render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('ADD TO CART')).toBeInTheDocument();

    rerender(<ProductCard product={mockOutOfStockProduct} />);
    expect(screen.getByText('OUT OF STOCK')).toBeInTheDocument();
  });

  it('calls onViewDetails when product is clicked', () => {
    const mockOnViewDetails = vi.fn();
    render(
      <ProductCard product={mockProduct} onViewDetails={mockOnViewDetails} />
    );

    fireEvent.click(screen.getByText('Test Product'));

    expect(mockOnViewDetails).toHaveBeenCalledWith(mockProduct);
  });

  it('displays size options when available', () => {
    const productWithSizes: MerchProduct = {
      ...mockProduct,
      sizes: ['S', 'M', 'L', 'XL'],
    };

    render(<ProductCard product={productWithSizes} />);

    expect(screen.getByText('Size:')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
    expect(screen.getByText('XL')).toBeInTheDocument();
  });

  it('displays color options when available', () => {
    const productWithColors: MerchProduct = {
      ...mockProduct,
      colors: ['Black', 'White', 'Gray'],
    };

    render(<ProductCard product={productWithColors} />);

    expect(screen.getByText('Color:')).toBeInTheDocument();
    expect(screen.getByText('Black')).toBeInTheDocument();
    expect(screen.getByText('White')).toBeInTheDocument();
    expect(screen.getByText('Gray')).toBeInTheDocument();
  });

  it('shows low stock warning when stock is below 10', () => {
    const lowStockProduct: MerchProduct = {
      ...mockProduct,
      stock: 5,
    };

    render(<ProductCard product={lowStockProduct} />);

    expect(screen.getByText('Only 5 left in stock!')).toBeInTheDocument();
  });

  it('allows size and color selection', () => {
    const productWithOptions: MerchProduct = {
      ...mockProduct,
      sizes: ['S', 'M', 'L'],
      colors: ['Black', 'White'],
    };

    render(<ProductCard product={productWithOptions} />);

    // Select size
    fireEvent.click(screen.getByText('M'));
    expect(screen.getByText('M')).toHaveClass('border-cyan-400');

    // Select color
    fireEvent.click(screen.getByText('White'));
    expect(screen.getByText('White')).toHaveClass('border-cyan-400');
  });

  it('disables add to cart button for out of stock products', () => {
    render(<ProductCard product={mockOutOfStockProduct} />);

    const addToCartButton = screen.getByRole('button', {
      name: /out of stock/i,
    });
    expect(addToCartButton).toBeDisabled();
  });
});
