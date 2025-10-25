import { MerchProduct, CartItem } from '../types';

export const merchProducts: MerchProduct[] = [
  {
    id: 'cyberpunk-sticker-pack',
    name: 'Cyberpunk Sticker Pack',
    description:
      'Collection of 12 holographic stickers featuring original cyberpunk designs. Water-resistant and perfect for laptops, phones, and gaming setups.',
    price: 12.99,
    currency: 'USD',
    category: 'Accessories',
    imageUrl:
      'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop',
    ],
    tags: ['stickers', 'cyberpunk', 'holographic', 'collectible'],
    inStock: true,
    stock: 150,
    featured: true,
    specifications: {
      Material: 'Holographic vinyl',
      Size: '2-4 inches per sticker',
      Quantity: '12 unique designs',
      'Water Resistance': 'Yes',
    },
    slug: 'cyberpunk-sticker-pack',
  },
  {
    id: 'digital-art-print-set',
    name: 'Digital Art Print Set',
    description:
      'Museum-quality prints of original digital artwork. Each set includes 3 prints on premium paper with archival inks for long-lasting color.',
    price: 29.99,
    currency: 'USD',
    category: 'Art',
    imageUrl:
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    ],
    tags: ['art', 'prints', 'digital', 'premium'],
    inStock: true,
    stock: 75,
    sizes: ['8x10', '11x14', '16x20'],
    featured: true,
    specifications: {
      Paper: 'Museum-quality archival paper',
      Ink: 'Archival pigment inks',
      Finish: 'Matte or Glossy',
      Quantity: '3 unique artworks',
    },
    slug: 'digital-art-print-set',
  },
  {
    id: 'neon-logo-tshirt',
    name: 'Neon Logo T-Shirt',
    description:
      'Premium cotton t-shirt featuring a glow-in-the-dark logo design. Comfortable fit with high-quality screen printing that lasts.',
    price: 24.99,
    currency: 'USD',
    category: 'Apparel',
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=600&fit=crop',
    ],
    tags: ['apparel', 'tshirt', 'glow-in-dark', 'cotton'],
    inStock: false,
    stock: 0,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Charcoal'],
    featured: false,
    specifications: {
      Material: '100% premium cotton',
      Fit: 'Unisex relaxed fit',
      Print: 'Glow-in-the-dark screen print',
      Care: 'Machine wash cold',
    },
    slug: 'neon-logo-tshirt',
  },
  {
    id: 'tech-enthusiast-mug',
    name: 'Tech Enthusiast Mug',
    description:
      'Color-changing ceramic mug with circuit board design. Watch the pattern come to life when you add hot liquid.',
    price: 16.99,
    currency: 'USD',
    category: 'Accessories',
    imageUrl:
      'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop',
    ],
    tags: ['mug', 'color-changing', 'ceramic', 'tech'],
    inStock: true,
    stock: 89,
    featured: true,
    specifications: {
      Material: 'High-quality ceramic',
      Capacity: '11 oz (325ml)',
      Feature: 'Color-changing design',
      'Microwave Safe': 'No (due to color-changing coating)',
    },
    slug: 'tech-enthusiast-mug',
  },
  {
    id: 'audio-waveform-poster',
    name: 'Audio Waveform Poster',
    description:
      'Minimalist poster featuring custom audio visualization art. Perfect for music studios, bedrooms, or any creative space.',
    price: 19.99,
    currency: 'USD',
    category: 'Art',
    imageUrl:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    ],
    tags: ['poster', 'audio', 'waveform', 'minimalist'],
    inStock: true,
    stock: 120,
    sizes: ['12x18', '18x24', '24x36'],
    featured: false,
    specifications: {
      Paper: 'Premium matte poster paper',
      Print: 'High-resolution digital print',
      Design: 'Custom audio waveform visualization',
      Frame: 'Not included',
    },
    slug: 'audio-waveform-poster',
  },
  {
    id: 'cyberpunk-hoodie',
    name: 'Cyberpunk Hoodie',
    description:
      'Premium heavyweight hoodie with embroidered cyberpunk graphics. Features kangaroo pocket and adjustable drawstring hood.',
    price: 49.99,
    currency: 'USD',
    category: 'Apparel',
    imageUrl:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800&h=600&fit=crop',
    ],
    tags: ['hoodie', 'cyberpunk', 'embroidered', 'premium'],
    inStock: true,
    stock: 45,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Charcoal', 'Navy'],
    featured: true,
    specifications: {
      Material: '80% cotton, 20% polyester',
      Weight: '9 oz heavyweight fleece',
      Features: 'Kangaroo pocket, drawstring hood',
      Embroidery: 'High-quality thread embroidery',
    },
    slug: 'cyberpunk-hoodie',
  },
];

export const merchCategories = [
  { id: 'all', name: 'All Products' },
  { id: 'apparel', name: 'Apparel' },
  { id: 'art', name: 'Art & Prints' },
  { id: 'accessories', name: 'Accessories' },
];

// Helper functions
export const getProductById = (id: string): MerchProduct | undefined => {
  return merchProducts.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): MerchProduct[] => {
  if (category === 'all') return merchProducts;
  return merchProducts.filter(
    product => product.category.toLowerCase() === category.toLowerCase()
  );
};

export const getFeaturedProducts = (): MerchProduct[] => {
  return merchProducts.filter(product => product.featured);
};

export const getInStockProducts = (): MerchProduct[] => {
  return merchProducts.filter(product => product.inStock);
};

export const formatPrice = (
  price: number,
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
};

export const calculateShipping = (subtotal: number): number => {
  // Free shipping over $50
  if (subtotal >= 50) return 0;
  // Flat rate shipping
  return 5.99;
};

export const calculateTax = (
  subtotal: number,
  taxRate: number = 0.08
): number => {
  return subtotal * taxRate;
};

export const calculateTotal = (
  subtotal: number,
  shipping: number,
  tax: number
): number => {
  return subtotal + shipping + tax;
};
