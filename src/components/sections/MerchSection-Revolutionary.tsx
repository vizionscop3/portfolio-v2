import {
  Calendar,
  Clock,
  CreditCard,
  Eye,
  Gift,
  Heart,
  Minus,
  Package,
  Palette,
  Plus,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  Users,
  X,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';

interface MerchItem {
  id: string;
  name: string;
  description: string;
  category:
    | 'Apparel'
    | 'Accessories'
    | 'Art Prints'
    | 'Digital'
    | 'Collectibles';
  price: number;
  originalPrice?: number;
  comingSoon: boolean;
  featured: boolean;
  likes: number;
  views: number;
  tags: string[];
  estimatedRelease?: string;
  imageUrl: string;
  availability: 'available' | 'pre-order' | 'sold-out';
  discount?: number;
}

interface CartItem extends MerchItem {
  quantity: number;
  size?: string;
  color?: string;
}

export const MerchSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MerchItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'featured'>('featured');

  const merchItems: MerchItem[] = [
    {
      id: '1',
      name: 'VizionScope Neon Hoodie',
      description:
        'Premium quality hoodie featuring the iconic VizionScope logo with reactive neon accents. Perfect for cyberpunk enthusiasts and late-night coding sessions.',
      category: 'Apparel',
      price: 89.99,
      originalPrice: 119.99,
      comingSoon: true,
      featured: true,
      likes: 2847,
      views: 15420,
      tags: ['hoodie', 'neon', 'cyberpunk', 'limited', 'reactive'],
      estimatedRelease: 'Q4 2024',
      imageUrl:
        'https://images.unsplash.com/photo-1556821840-3a9b6823a4c8?w=800&h=1200&fit=crop',
      availability: 'pre-order',
      discount: 25,
    },
    {
      id: '2',
      name: 'Holographic Tech Tee',
      description:
        'Soft cotton t-shirt with holographic VizionScope branding that shifts colors in different lighting. Eco-friendly and comfortable.',
      category: 'Apparel',
      price: 34.99,
      comingSoon: true,
      featured: true,
      likes: 1892,
      views: 8925,
      tags: ['t-shirt', 'holographic', 'cotton', 'unisex', 'eco-friendly'],
      estimatedRelease: 'Q4 2024',
      imageUrl:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1200&fit=crop',
      availability: 'pre-order',
    },
    {
      id: '3',
      name: 'Cyberpunk Snapback',
      description:
        'Adjustable snapback hat with embroidered VizionScope logo and LED strip accent around the brim. Battery-powered with USB charging.',
      category: 'Accessories',
      price: 49.99,
      comingSoon: true,
      featured: false,
      likes: 1567,
      views: 7430,
      tags: ['hat', 'snapback', 'led', 'adjustable', 'rechargeable'],
      estimatedRelease: 'Q1 2025',
      imageUrl:
        'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=1200&fit=crop',
      availability: 'pre-order',
    },
    {
      id: '4',
      name: 'Digital Dreams Art Print',
      description:
        'High-quality giclée print of original VizionScope digital artwork. Limited edition of 100, numbered and hand-signed.',
      category: 'Art Prints',
      price: 79.99,
      comingSoon: true,
      featured: true,
      likes: 3124,
      views: 18760,
      tags: ['art print', 'limited edition', 'signed', 'giclée', 'numbered'],
      estimatedRelease: 'Q4 2024',
      imageUrl:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop',
      availability: 'pre-order',
    },
    {
      id: '5',
      name: 'Neon City Poster Set',
      description:
        "Collection of three cyberpunk-inspired posters featuring VizionScope's signature aesthetic. Perfect for creating the ultimate tech cave.",
      category: 'Art Prints',
      price: 59.99,
      originalPrice: 89.97,
      comingSoon: true,
      featured: false,
      likes: 1980,
      views: 10450,
      tags: ['poster', 'set', 'cyberpunk', 'collection', 'bundle'],
      estimatedRelease: 'Q4 2024',
      imageUrl:
        'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&h=1200&fit=crop',
      availability: 'pre-order',
      discount: 33,
    },
    {
      id: '6',
      name: 'VR Sticker Pack',
      description:
        'Waterproof vinyl stickers featuring various VizionScope designs perfect for laptops, phones, and gear. Glows under UV light.',
      category: 'Accessories',
      price: 19.99,
      comingSoon: true,
      featured: false,
      likes: 876,
      views: 5670,
      tags: ['stickers', 'vinyl', 'waterproof', 'pack', 'uv-reactive'],
      estimatedRelease: 'Q4 2024',
      imageUrl:
        'https://images.unsplash.com/photo-1609205807107-c5fe6e41fb64?w=800&h=1200&fit=crop',
      availability: 'pre-order',
    },
    {
      id: '7',
      name: 'Exclusive Digital Wallpaper Pack',
      description:
        'High-resolution digital wallpapers for desktop and mobile featuring exclusive VizionScope artwork. Updated monthly with new designs.',
      category: 'Digital',
      price: 14.99,
      comingSoon: false,
      featured: true,
      likes: 4456,
      views: 23410,
      tags: ['digital', 'wallpaper', 'exclusive', 'hd', 'subscription'],
      imageUrl:
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=1200&fit=crop',
      availability: 'available',
    },
    {
      id: '8',
      name: 'VizionScope NFT Collection',
      description:
        'Limited edition NFT artwork collection featuring unique generative art pieces from the VizionScope universe. Includes exclusive Discord access.',
      category: 'Digital',
      price: 249.99,
      comingSoon: true,
      featured: true,
      likes: 6789,
      views: 34560,
      tags: ['nft', 'blockchain', 'generative', 'limited', 'exclusive'],
      estimatedRelease: 'Q1 2025',
      imageUrl:
        'https://images.unsplash.com/photo-1640161704729-cbe966a08476?w=800&h=1200&fit=crop',
      availability: 'pre-order',
    },
  ];

  const categories = [
    {
      id: 'all',
      label: 'ALL.MERCH',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'cyber-primary',
    },
    {
      id: 'Apparel',
      label: 'APPAREL',
      icon: <Users className="w-5 h-5" />,
      color: 'cyber-secondary',
    },
    {
      id: 'Accessories',
      label: 'ACCESSORIES',
      icon: <Gift className="w-5 h-5" />,
      color: 'cyber-accent',
    },
    {
      id: 'Art Prints',
      label: 'ART.PRINTS',
      icon: <Palette className="w-5 h-5" />,
      color: 'neon-pink',
    },
    {
      id: 'Digital',
      label: 'DIGITAL',
      icon: <Zap className="w-5 h-5" />,
      color: 'neon-cyan',
    },
    {
      id: 'Collectibles',
      label: 'COLLECTIBLES',
      icon: <Star className="w-5 h-5" />,
      color: 'neon-gold',
    },
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? merchItems
      : merchItems.filter(item => item.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'cyber-primary';
  };

  const addToCart = (item: MerchItem, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getAvailabilityInfo = (item: MerchItem) => {
    switch (item.availability) {
      case 'available':
        return {
          text: 'Available Now',
          color: 'neon-green',
          icon: <Package className="w-4 h-4" />,
        };
      case 'pre-order':
        return {
          text: 'Pre-Order',
          color: 'cyber-secondary',
          icon: <Clock className="w-4 h-4" />,
        };
      case 'sold-out':
        return {
          text: 'Sold Out',
          color: 'secondary',
          icon: <X className="w-4 h-4" />,
        };
      default:
        return {
          text: 'Coming Soon',
          color: 'cyber-accent',
          icon: <Calendar className="w-4 h-4" />,
        };
    }
  };

  return (
    <div className="page-revolutionary revolutionary-gpu-accelerated">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Revolutionary Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/10 to-cyber-secondary/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <div className="mb-8 relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary via-cyber-secondary to-cyber-accent rounded-full blur-xl opacity-75 animate-revolutionary"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-cyber-primary via-cyber-secondary to-cyber-accent rounded-full flex items-center justify-center shadow-revolutionary">
                <ShoppingBag className="w-16 h-16 text-black" />
              </div>
            </div>

            <h1 className="text-6xl font-cyber font-bold text-revolutionary mb-4 tracking-wider animate-cyber-pulse">
              MERCH.STORE
            </h1>
            <div className="text-xl font-mono text-cyber-glow mb-6 tracking-wide">
              &lt;Limited Editions | Digital Assets | Premium Quality /&gt;
            </div>

            <div className="flex justify-center items-center gap-6 text-secondary text-sm font-mono flex-wrap">
              <div className="flex items-center gap-2 animate-micro-bounce">
                <ShoppingBag className="w-4 h-4 text-cyber-primary" />
                <span>Premium Merchandise</span>
              </div>
              <div className="flex items-center gap-2 animate-micro-bounce delay-100">
                <Shield className="w-4 h-4 text-cyber-secondary" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2 animate-micro-bounce delay-200">
                <Truck className="w-4 h-4 text-cyber-accent" />
                <span>Worldwide Shipping</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shopping Cart Button */}
        <div className="fixed top-20 right-6 z-50">
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="button-revolutionary button-primary relative p-4"
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-neon-pink text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-cyber-pulse">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Shopping Cart Sidebar */}
        {cartOpen && (
          <div className="fixed inset-0 z-40 pointer-events-none">
            <div
              className="absolute inset-0 bg-black/50 pointer-events-auto"
              onClick={() => setCartOpen(false)}
            ></div>
            <div className="absolute right-0 top-0 h-full w-96 card-revolutionary pointer-events-auto overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-cyber text-white">CART.CYBER</h3>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="p-2 text-secondary hover:text-white transition-colors"
                    aria-label="Close cart"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-secondary mx-auto mb-4" />
                    <p className="text-secondary">Your cart is empty</p>
                    <p className="text-sm text-secondary mt-2">
                      Add some cyberpunk merch to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="card-revolutionary">
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-cyber text-white text-sm mb-1">
                                {item.name}
                              </h4>
                              <p className="text-cyber-primary font-mono text-sm">
                                {formatPrice(item.price)}
                              </p>

                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  className="w-6 h-6 rounded bg-cyber-primary/20 hover:bg-cyber-primary/40 flex items-center justify-center transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-white font-mono text-sm w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="w-6 h-6 rounded bg-cyber-primary/20 hover:bg-cyber-primary/40 flex items-center justify-center transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="ml-auto text-secondary hover:text-neon-pink transition-colors"
                                  aria-label="Remove item"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="border-t border-cyber-primary/20 pt-4 mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-white font-cyber">TOTAL:</span>
                        <span className="text-2xl font-cyber text-cyber-primary">
                          {formatPrice(getCartTotal())}
                        </span>
                      </div>

                      <button className="button-revolutionary button-primary w-full flex items-center justify-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        SECURE.CHECKOUT
                      </button>

                      <p className="text-xs text-secondary text-center mt-3">
                        Secure payment powered by Stripe
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Category Filter & View Toggle */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-12 gap-6">
          {/* Category Filter */}
          <div className="flex justify-center overflow-x-auto">
            <div className="card-revolutionary p-2 inline-flex rounded-2xl min-w-max">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative px-4 py-3 font-mono font-bold tracking-wider transition-all duration-300 rounded-xl mx-1 ${
                    selectedCategory === category.id
                      ? `text-${category.color} bg-gradient-to-r from-${category.color}/20 to-cyber-secondary/20 shadow-cyber-glow animate-cyber-pulse`
                      : 'text-secondary hover:text-white hover:bg-cyber-primary/10 interactive-revolutionary'
                  }`}
                >
                  {selectedCategory === category.id && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-${category.color}/10 to-cyber-secondary/10 rounded-xl animate-energy-wave`}
                    ></div>
                  )}
                  <span className="relative z-10 flex items-center gap-2 text-sm">
                    {category.icon}
                    {category.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="card-revolutionary p-2 inline-flex rounded-xl">
            <button
              onClick={() => setViewMode('featured')}
              className={`relative px-4 py-2 font-mono transition-all duration-300 rounded-lg ${
                viewMode === 'featured'
                  ? 'text-cyber-primary bg-cyber-primary/20 shadow-cyber-glow'
                  : 'text-secondary hover:text-white'
              }`}
              aria-label="Featured view"
            >
              <Star className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`relative px-4 py-2 font-mono transition-all duration-300 rounded-lg ${
                viewMode === 'grid'
                  ? 'text-cyber-primary bg-cyber-primary/20 shadow-cyber-glow'
                  : 'text-secondary hover:text-white'
              }`}
              aria-label="Grid view"
            >
              <Package className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        {!selectedItem ? (
          <div className="space-y-8">
            {/* Featured Items Showcase */}
            {viewMode === 'featured' && (
              <div className="grid lg:grid-cols-2 gap-8">
                {filteredItems
                  .filter(item => item.featured)
                  .map(item => {
                    const availability = getAvailabilityInfo(item);
                    return (
                      <div
                        key={item.id}
                        className="card-revolutionary hover-glow group cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                          />

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  if (item.availability !== 'sold-out') {
                                    addToCart(item);
                                  }
                                }}
                                disabled={item.availability === 'sold-out'}
                                className="button-revolutionary button-primary w-full"
                              >
                                {item.availability === 'sold-out'
                                  ? 'SOLD.OUT'
                                  : 'ADD.TO.CART'}
                              </button>
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {item.featured && (
                              <span className="pill-revolutionary bg-neon-gold text-black">
                                <Star className="w-3 h-3" />
                                FEATURED
                              </span>
                            )}
                            {item.discount && (
                              <span className="pill-revolutionary bg-neon-pink text-black">
                                -{item.discount}% OFF
                              </span>
                            )}
                          </div>

                          <div className="absolute top-4 right-4">
                            <span
                              className={`pill-revolutionary bg-${availability.color} text-black flex items-center gap-1`}
                            >
                              {availability.icon}
                              {availability.text}
                            </span>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`text-${getCategoryColor(item.category)} font-cyber text-xs uppercase tracking-wider`}
                            >
                              {item.category}
                            </span>
                          </div>

                          <h3 className="text-xl font-cyber text-white mb-3 group-hover:text-cyber-primary transition-colors">
                            {item.name}
                          </h3>

                          <p className="text-secondary text-sm mb-4 line-clamp-2">
                            {item.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {item.originalPrice ? (
                                <>
                                  <span className="text-2xl font-cyber text-cyber-primary">
                                    {formatPrice(item.price)}
                                  </span>
                                  <span className="text-sm text-secondary line-through">
                                    {formatPrice(item.originalPrice)}
                                  </span>
                                </>
                              ) : (
                                <span className="text-2xl font-cyber text-cyber-primary">
                                  {formatPrice(item.price)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-xs text-secondary font-mono">
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3 text-neon-pink" />
                                <span>{formatNumber(item.likes)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{formatNumber(item.views)}</span>
                              </div>
                            </div>
                          </div>

                          {item.estimatedRelease && (
                            <div className="mt-4 text-xs text-secondary font-mono">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              Release: {item.estimatedRelease}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Grid View */}
            <div
              className={`grid gap-6 ${viewMode === 'featured' ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'}`}
            >
              {(viewMode === 'grid'
                ? filteredItems
                : filteredItems.filter(item => !item.featured)
              ).map(item => {
                const availability = getAvailabilityInfo(item);
                return (
                  <div
                    key={item.id}
                    className="card-revolutionary hover-glow group cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Quick Add Button */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            if (item.availability !== 'sold-out') {
                              addToCart(item);
                            }
                          }}
                          disabled={item.availability === 'sold-out'}
                          className="button-revolutionary button-primary"
                        >
                          {item.availability === 'sold-out'
                            ? 'SOLD.OUT'
                            : 'QUICK.ADD'}
                        </button>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {item.featured && (
                          <span className="pill-revolutionary bg-neon-gold text-black text-xs">
                            <Star className="w-2 h-2" />
                          </span>
                        )}
                        {item.discount && (
                          <span className="pill-revolutionary bg-neon-pink text-black text-xs">
                            -{item.discount}%
                          </span>
                        )}
                      </div>

                      <div className="absolute top-2 right-2">
                        <span
                          className={`pill-revolutionary bg-${availability.color} text-black text-xs`}
                        >
                          {availability.icon}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-cyber text-white text-sm mb-2 group-hover:text-cyber-primary transition-colors">
                        {item.name}
                      </h3>

                      <div className="flex items-center justify-between">
                        {item.originalPrice ? (
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-cyber text-cyber-primary">
                              {formatPrice(item.price)}
                            </span>
                            <span className="text-xs text-secondary line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-cyber text-cyber-primary">
                            {formatPrice(item.price)}
                          </span>
                        )}

                        <div className="flex items-center gap-2 text-xs text-secondary">
                          <Heart className="w-3 h-3 text-neon-pink" />
                          <span>{formatNumber(item.likes)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Selected Item Detail View */
          <div className="space-y-8">
            {/* Back Navigation */}
            <button
              onClick={() => setSelectedItem(null)}
              className="button-revolutionary button-secondary flex items-center gap-2"
            >
              ← BACK.TO.STORE
            </button>

            {/* Item Details */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Image */}
              <div className="card-revolutionary overflow-hidden">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    {selectedItem.featured && (
                      <Star className="w-6 h-6 text-neon-gold" />
                    )}
                    <span
                      className={`text-${getCategoryColor(selectedItem.category)} font-cyber text-lg uppercase tracking-wider`}
                    >
                      {selectedItem.category}
                    </span>
                  </div>

                  <h1 className="text-4xl font-cyber text-revolutionary mb-4">
                    {selectedItem.name}
                  </h1>

                  <p className="text-white text-lg leading-relaxed mb-6">
                    {selectedItem.description}
                  </p>

                  {/* Pricing */}
                  <div className="flex items-center gap-4 mb-6">
                    {selectedItem.originalPrice ? (
                      <>
                        <span className="text-4xl font-cyber text-cyber-primary">
                          {formatPrice(selectedItem.price)}
                        </span>
                        <span className="text-xl text-secondary line-through">
                          {formatPrice(selectedItem.originalPrice)}
                        </span>
                        <span className="pill-revolutionary bg-neon-pink text-black">
                          SAVE{' '}
                          {formatPrice(
                            selectedItem.originalPrice - selectedItem.price
                          )}
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl font-cyber text-cyber-primary">
                        {formatPrice(selectedItem.price)}
                      </span>
                    )}
                  </div>

                  {/* Availability */}
                  <div className="card-revolutionary bg-gradient-to-r from-cyber-primary/10 to-cyber-secondary/10 mb-6">
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        {getAvailabilityInfo(selectedItem).icon}
                        <span className="font-cyber text-white">
                          {getAvailabilityInfo(selectedItem).text}
                        </span>
                        {selectedItem.estimatedRelease && (
                          <span className="text-secondary font-mono text-sm">
                            • {selectedItem.estimatedRelease}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={() => addToCart(selectedItem)}
                    disabled={selectedItem.availability === 'sold-out'}
                    className="button-revolutionary button-primary w-full text-lg py-4 mb-6"
                  >
                    {selectedItem.availability === 'sold-out'
                      ? 'SOLD.OUT'
                      : selectedItem.availability === 'pre-order'
                        ? 'PRE-ORDER.NOW'
                        : 'ADD.TO.CART'}
                  </button>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card-revolutionary text-center">
                      <div className="p-4">
                        <div className="flex items-center justify-center gap-2 text-neon-pink mb-2">
                          <Heart className="w-5 h-5" />
                          <span className="text-2xl font-cyber">
                            {formatNumber(selectedItem.likes)}
                          </span>
                        </div>
                        <span className="text-secondary text-sm">Likes</span>
                      </div>
                    </div>
                    <div className="card-revolutionary text-center">
                      <div className="p-4">
                        <div className="flex items-center justify-center gap-2 text-cyber-secondary mb-2">
                          <Eye className="w-5 h-5" />
                          <span className="text-2xl font-cyber">
                            {formatNumber(selectedItem.views)}
                          </span>
                        </div>
                        <span className="text-secondary text-sm">Views</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="font-cyber text-white mb-4">TAGS</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map(tag => (
                        <span key={tag} className="pill-revolutionary text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revolutionary Store Philosophy */}
        {!selectedItem && (
          <div className="mt-16 card-revolutionary text-center revolutionary-shimmer">
            <div className="p-8">
              <h3 className="text-3xl font-cyber text-revolutionary mb-4 flex items-center justify-center gap-3">
                <span className="text-4xl animate-revolutionary">🛍️</span>
                STORE.PHILOSOPHY
              </h3>
              <p className="text-white mb-6 text-lg max-w-4xl mx-auto leading-relaxed">
                Every piece in our collection represents the intersection of
                art, technology, and personal expression. From sustainable
                materials to cutting-edge design, we create merchandise that
                tells your story while pushing the boundaries of what wearable
                tech can become.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <div className="pill-revolutionary">Premium Quality</div>
                <div className="pill-revolutionary">Limited Editions</div>
                <div className="pill-revolutionary">Sustainable Materials</div>
                <div className="pill-revolutionary">Global Shipping</div>
                <div className="pill-revolutionary">Secure Payments</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchSection;
