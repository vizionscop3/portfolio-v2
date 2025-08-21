import { CartItem } from '@/types';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CartSidebar } from '../CartSidebar';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  X: ({ size, ...props }: any) => (
    <svg data-testid="x-icon" {...props}>
      {size}
    </svg>
  ),
  Plus: ({ size, ...props }: any) => (
    <svg data-testid="plus-icon" {...props}>
      {size}
    </svg>
  ),
  Minus: ({ size, ...props }: any) => (
    <svg data-testid="minus-icon" {...props}>
      {size}
    </svg>
  ),
  ShoppingBag: ({ size, ...props }: any) => (
    <svg data-testid="shopping-bag-icon" {...props}>
      {size}
    </svg>
  ),
  CreditCard: ({ size, ...props }: any) => (
    <svg data-testid="credit-card-icon" {...props}>
      {size}
    </svg>
  ),
}));

// Mock cart store
const mockCartStore = {
  isOpen: true,
  closeCart: vi.fn(),
  updateQuantity: vi.fn(),
  removeItem: vi.fn(),
};

const mockCartItems: CartItem[] = [
  {
    product: {
      id: 'test-product-1',
      name: 'Test Product 1',
      description: 'First test product',
      price: 19.99,
      currency: 'USD',
      category: 'Test',
      imageUrl: 'https://example.com/product1.jpg',
      images: ['https://example.com/product1.jpg'],
      tags: ['test'],
      inStock: true,
      featured: false,
      slug: 'test-product-1',
    },
    quantity: 2,
    selectedSize: 'M',
    selectedColor: 'Blue',
  },
  {
    product: {
      id: 'test-product-2',
      name: 'Test Product 2',
      description: 'Second test product',
      price: 29.99,
      currency: 'USD',
      category: 'Test',
      imageUrl: 'https://example.com/product2.jpg',
      images: ['https://example.com/product2.jpg'],
      tags: ['test'],
      inStock: true,
      featured: false,
      slug: 'test-product-2',
    },
    quantity: 1,
  },
];

const mockCartTotals = {
  subtotal: 69.97,
  shipping: 0, // Free shipping over $50
  tax: 5.6,
  total: 75.57,
};

vi.mock('@/store/cartStore', () => ({
  useCartStore: () => mockCartStore,
  useCartItems: () => mockCartItems,
  useCartTotals: () => mockCartTotals,
}));

describe('CartSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays cart items correctly', () => {
    render(<CartSidebar />);

    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('shows item quantities and options', () => {
    render(<CartSidebar />);

    expect(screen.getByText('2')).toBeInTheDocument(); // quantity for first item
    expect(screen.getByText('1')).toBeInTheDocument(); // quantity for second item
    expect(screen.getByText('Size: M')).toBeInTheDocument();
    expect(screen.getByText('Color: Blue')).toBeInTheDocument();
  });

  it('displays correct totals', () => {
    render(<CartSidebar />);

    expect(screen.getByText('$69.97')).toBeInTheDocument(); // subtotal
    expect(screen.getByText('FREE')).toBeInTheDocument(); // free shipping
    expect(screen.getByText('$5.60')).toBeInTheDocument(); // tax
    expect(screen.getByText('$75.57')).toBeInTheDocument(); // total
  });

  it('shows cart item count in header', () => {
    render(<CartSidebar />);

    expect(screen.getByText('3')).toBeInTheDocument(); // total quantity (2 + 1)
  });

  it('calls updateQuantity when quantity buttons are clicked', () => {
    render(<CartSidebar />);

    // Click plus button for first item
    const plusButtons = screen.getAllByRole('button');
    const plusButton = plusButtons.find(
      button => button.textContent?.includes('+') || button.querySelector('svg') // Plus icon
    );

    if (plusButton) {
      fireEvent.click(plusButton);
      expect(mockCartStore.updateQuantity).toHaveBeenCalled();
    }
  });

  it('calls removeItem when remove button is clicked', () => {
    render(<CartSidebar />);

    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);

    expect(mockCartStore.removeItem).toHaveBeenCalledWith(
      'test-product-1',
      'M',
      'Blue'
    );
  });

  it('calls closeCart when close button is clicked', () => {
    render(<CartSidebar />);

    const closeButton = screen.getByTitle('Close cart');
    fireEvent.click(closeButton);

    expect(mockCartStore.closeCart).toHaveBeenCalled();
  });

  it('displays checkout button', () => {
    render(<CartSidebar />);

    expect(screen.getByText('SECURE CHECKOUT')).toBeInTheDocument();
  });

  it('shows security notice', () => {
    render(<CartSidebar />);

    expect(
      screen.getByText('🔒 Secure SSL encrypted checkout')
    ).toBeInTheDocument();
  });
});

// Test for empty cart state
describe('CartSidebar - Empty State', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays empty cart message when no items', () => {
    vi.mock('@/store/cartStore', () => ({
      useCartStore: () => ({
        ...mockCartStore,
      }),
      useCartItems: () => [],
      useCartTotals: () => ({
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
      }),
    }));

    render(<CartSidebar />);

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(
      screen.getByText('Add some products to get started!')
    ).toBeInTheDocument();
  });
});
