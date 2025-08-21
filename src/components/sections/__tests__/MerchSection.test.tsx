import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MerchSection } from '../MerchSection';

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
  ShoppingBag: ({ size, ...props }: any) => (
    <svg data-testid="shopping-bag-icon" {...props}>
      {size}
    </svg>
  ),
  Star: ({ size, ...props }: any) => (
    <svg data-testid="star-icon" {...props}>
      {size}
    </svg>
  ),
  Zap: ({ size, ...props }: any) => (
    <svg data-testid="zap-icon" {...props}>
      {size}
    </svg>
  ),
  Shield: ({ size, ...props }: any) => (
    <svg data-testid="shield-icon" {...props}>
      {size}
    </svg>
  ),
}));

// Mock cart store
vi.mock('@/store/cartStore', () => ({
  useCartStore: () => ({
    openCart: vi.fn(),
  }),
  useCartCount: () => 2,
}));

// Mock merchandise components
vi.mock('@/components/merch', () => ({
  ProductCard: ({ product, onViewDetails }: any) => (
    <div
      data-testid={`product-${product.id}`}
      onClick={() => onViewDetails?.(product)}
    >
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <span>${product.price}</span>
      <div>{product.category}</div>
      {product.featured && <span>FEATURED</span>}
      {!product.inStock && <span>OUT OF STOCK</span>}
    </div>
  ),
  CartSidebar: () => <div data-testid="cart-sidebar">Cart Sidebar</div>,
  ProductDetailModal: ({ product, isOpen }: any) =>
    isOpen && product ? (
      <div data-testid="product-modal">
        <h2>{product.name} Details</h2>
      </div>
    ) : null,
}));

describe('MerchSection', () => {
  it('renders the merchandise store header', () => {
    render(<MerchSection />);

    expect(screen.getByText('Merchandise Store')).toBeInTheDocument();
    expect(
      screen.getByText(/Support the creative journey/)
    ).toBeInTheDocument();
  });

  it('displays feature highlights', () => {
    render(<MerchSection />);

    expect(screen.getByText('Free Shipping')).toBeInTheDocument();
    expect(screen.getByText('On orders over $50')).toBeInTheDocument();
    expect(screen.getByText('Premium Quality')).toBeInTheDocument();
    expect(screen.getByText('Secure Payment')).toBeInTheDocument();
  });

  it('shows cart button with item count', () => {
    render(<MerchSection />);

    const cartButton = screen.getByRole('button');
    expect(cartButton).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // cart count
  });

  it('displays category filter buttons', () => {
    render(<MerchSection />);

    expect(screen.getByText('ALL PRODUCTS')).toBeInTheDocument();
    expect(screen.getByText('APPAREL')).toBeInTheDocument();
    expect(screen.getByText('ART & PRINTS')).toBeInTheDocument();
    expect(screen.getByText('ACCESSORIES')).toBeInTheDocument();
  });

  it('shows featured products section when all category is selected', () => {
    render(<MerchSection />);

    expect(screen.getByText('Featured Products')).toBeInTheDocument();
  });

  it('displays product cards', () => {
    render(<MerchSection />);

    // Check for some expected products
    expect(screen.getByText('Cyberpunk Sticker Pack')).toBeInTheDocument();
    expect(screen.getByText('Digital Art Print Set')).toBeInTheDocument();
    expect(screen.getByText('Tech Enthusiast Mug')).toBeInTheDocument();
  });

  it('filters products when category is selected', () => {
    render(<MerchSection />);

    // Click on Apparel category
    fireEvent.click(screen.getByText('APPAREL'));

    // Should still show apparel products
    expect(screen.getByText('Cyberpunk Hoodie')).toBeInTheDocument();

    // Featured products section should be hidden when filtering
    expect(screen.queryByText('Featured Products')).not.toBeInTheDocument();
  });

  it('opens product detail modal when product is clicked', () => {
    render(<MerchSection />);

    // Click on a product
    const product = screen.getByTestId('product-cyberpunk-sticker-pack');
    fireEvent.click(product);

    // Modal should appear
    expect(screen.getByTestId('product-modal')).toBeInTheDocument();
    expect(
      screen.getByText('Cyberpunk Sticker Pack Details')
    ).toBeInTheDocument();
  });

  it('displays store information section', () => {
    render(<MerchSection />);

    expect(screen.getByText('Shipping & Returns')).toBeInTheDocument();
    expect(screen.getByText('Quality Guarantee')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();

    expect(
      screen.getByText('Free shipping on orders over $50')
    ).toBeInTheDocument();
    expect(screen.getByText('30-day return policy')).toBeInTheDocument();
    expect(screen.getByText('24/7 customer support')).toBeInTheDocument();
  });

  it('renders cart sidebar component', () => {
    render(<MerchSection />);

    expect(screen.getByTestId('cart-sidebar')).toBeInTheDocument();
  });

  it('highlights selected category button', () => {
    render(<MerchSection />);

    const allButton = screen.getByText('ALL PRODUCTS');
    expect(allButton).toHaveClass(
      'border-magenta-400',
      'bg-magenta-400',
      'text-black'
    );

    // Click on another category
    fireEvent.click(screen.getByText('APPAREL'));

    const apparelButton = screen.getByText('APPAREL');
    expect(apparelButton).toHaveClass(
      'border-magenta-400',
      'bg-magenta-400',
      'text-black'
    );
  });

  it('shows featured badges for featured products', () => {
    render(<MerchSection />);

    // Featured products should have FEATURED badge
    const featuredElements = screen.getAllByText('FEATURED');
    expect(featuredElements.length).toBeGreaterThan(0);
  });

  it('shows out of stock status for unavailable products', () => {
    render(<MerchSection />);

    // Check for out of stock products
    const outOfStockElements = screen.getAllByText('OUT OF STOCK');
    expect(outOfStockElements.length).toBeGreaterThan(0);
  });
});
