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
      label: 'All Items',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'purple-400',
    },
    {
      id: 'Apparel',
      label: 'Apparel',
      icon: <Users className="w-5 h-5" />,
      color: 'purple-500',
    },
    {
      id: 'Accessories',
      label: 'Accessories',
      icon: <Gift className="w-5 h-5" />,
      color: 'purple-600',
    },
    {
      id: 'Art Prints',
      label: 'Art Prints',
      icon: <Palette className="w-5 h-5" />,
      color: 'purple-300',
    },
    {
      id: 'Digital',
      label: 'Digital',
      icon: <Zap className="w-5 h-5" />,
      color: 'purple-700',
    },
    {
      id: 'Collectibles',
      label: 'Collectibles',
      icon: <Star className="w-5 h-5" />,
      color: 'purple-200',
    },
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? merchItems
      : merchItems.filter(item => item.category === selectedCategory);

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
    <div className="min-h-screen bg-[#0D0D0D] relative">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-purple-900/20 to-black"></div>
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Space-themed Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="mb-8 relative inline-block">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mb-6 hover:scale-110 transition-all duration-500 shadow-lg mx-auto">
              <ShoppingBag className="w-16 h-16 text-white" />
            </div>
          </div>

          <h1 className="text-9xl md:text-[12rem] lg:text-[16rem] font-black mb-8 leading-tight">
            <span className="block bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 bg-clip-text text-transparent font-black tracking-wider glow-text">
              Merch Store
            </span>
          </h1>
          <p className="text-4xl md:text-6xl lg:text-7xl text-purple-200 mb-8 font-bold tracking-wide">
            Digital Universe Collection
          </p>

          <div className="flex justify-center items-center gap-6 text-gray-300 text-lg font-bold flex-wrap">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span>Premium Merchandise</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-purple-400" />
              <span>Worldwide Shipping</span>
            </div>
          </div>
        </div>

        {/* Shopping Cart Button */}
        <div className="fixed top-20 right-6 z-50">
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="group relative p-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold rounded-xl overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
            <ShoppingCart className="w-6 h-6 relative z-10" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-400 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
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
            <div className="absolute right-0 top-0 h-full w-96 bg-[#0D0D0D] border border-purple-500/20 pointer-events-auto overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-3xl font-black text-white">
                    Shopping Cart
                  </h3>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    aria-label="Close cart"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 font-bold">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-gray-400 mt-2 font-bold">
                      Add some items to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div
                        key={item.id}
                        className="bg-[#0D0D0D] border border-purple-500/20 rounded-xl p-4"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-xl"
                          />
                          <div className="flex-1">
                            <h4 className="font-black text-white text-sm mb-1">
                              {item.name}
                            </h4>
                            <p className="text-purple-400 font-bold text-sm">
                              {formatPrice(item.price)}
                            </p>

                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="w-6 h-6 rounded bg-purple-500/20 hover:bg-purple-500/40 flex items-center justify-center transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-white font-bold text-sm w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="w-6 h-6 rounded bg-purple-500/20 hover:bg-purple-500/40 flex items-center justify-center transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="ml-auto text-gray-400 hover:text-purple-300 transition-colors"
                                aria-label="Remove item"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="border-t border-purple-500/20 pt-4 mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-white font-black text-lg">
                          TOTAL:
                        </span>
                        <span className="text-2xl font-black text-purple-400">
                          {formatPrice(getCartTotal())}
                        </span>
                      </div>

                      <button className="group relative w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold rounded-xl overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 gap-2">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                        <span className="relative z-10 flex items-center gap-2 font-black">
                          <CreditCard className="w-5 h-5" />
                          SECURE CHECKOUT
                        </span>
                      </button>

                      <p className="text-xs text-gray-400 text-center mt-3 font-bold">
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
            <div className="bg-[#0D0D0D] border border-purple-500/20 p-2 inline-flex rounded-2xl min-w-max">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative px-4 py-3 font-bold tracking-wider transition-all duration-300 rounded-xl mx-1 ${
                    selectedCategory === category.id
                      ? `text-white bg-gradient-to-r from-purple-500/20 to-purple-400/20 border border-purple-400/40`
                      : 'text-gray-300 hover:text-white hover:bg-purple-500/10'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2 text-sm">
                    {category.icon}
                    {category.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="bg-[#0D0D0D] border border-purple-500/20 p-2 inline-flex rounded-xl">
            <button
              onClick={() => setViewMode('featured')}
              className={`relative px-4 py-2 font-bold transition-all duration-300 rounded-lg ${
                viewMode === 'featured'
                  ? 'text-white bg-purple-500/20 border border-purple-400/40'
                  : 'text-gray-300 hover:text-white'
              }`}
              aria-label="Featured view"
            >
              <Star className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`relative px-4 py-2 font-bold transition-all duration-300 rounded-lg ${
                viewMode === 'grid'
                  ? 'text-white bg-purple-500/20 border border-purple-400/40'
                  : 'text-gray-300 hover:text-white'
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
                        className="group relative overflow-hidden rounded-2xl bg-[#0D0D0D] border border-purple-500/20 transform hover:scale-105 transition-all duration-700 hover:shadow-2xl hover:shadow-purple-500/30 hover:border-purple-400/40 cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>

                        <div className="relative z-10 p-6">
                          <div className="relative">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-64 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                              <div className="absolute bottom-0 left-0 right-0 p-6">
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    if (item.availability !== 'sold-out') {
                                      addToCart(item);
                                    }
                                  }}
                                  disabled={item.availability === 'sold-out'}
                                  className="group w-full relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold rounded-xl overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                                  <span className="relative z-10 font-black">
                                    {item.availability === 'sold-out'
                                      ? 'SOLD OUT'
                                      : 'ADD TO CART'}
                                  </span>
                                </button>
                              </div>
                            </div>

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                              {item.featured && (
                                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                  <Star className="w-3 h-3" />
                                  FEATURED
                                </span>
                              )}
                              {item.discount && (
                                <span className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-3 py-1 rounded-full text-sm font-bold">
                                  -{item.discount}% OFF
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Availability Badge */}
                          <div className="absolute top-4 right-4">
                            <span
                              className={`bg-${availability.color === 'cyber-primary' ? 'purple-500' : availability.color === 'cyber-secondary' ? 'purple-600' : 'gray-500'} text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1`}
                            >
                              {availability.icon}
                              {availability.text}
                            </span>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`text-purple-400 font-bold text-xs uppercase tracking-wider`}
                            >
                              {item.category}
                            </span>
                          </div>

                          <h3 className="text-2xl font-black text-white mb-3 group-hover:text-purple-300 transition-colors">
                            {item.name}
                          </h3>

                          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                            {item.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {item.originalPrice ? (
                                <>
                                  <span className="text-2xl font-black text-purple-400">
                                    {formatPrice(item.price)}
                                  </span>
                                  <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(item.originalPrice)}
                                  </span>
                                </>
                              ) : (
                                <span className="text-2xl font-black text-purple-400">
                                  {formatPrice(item.price)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-400 font-bold">
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3 text-purple-300" />
                                <span>{formatNumber(item.likes)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{formatNumber(item.views)}</span>
                              </div>
                            </div>
                          </div>

                          {item.estimatedRelease && (
                            <div className="mt-4 text-xs text-gray-400 font-bold">
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
                    className="group relative overflow-hidden rounded-2xl bg-[#0D0D0D] border border-purple-500/20 transform hover:scale-105 transition-all duration-700 hover:shadow-2xl hover:shadow-purple-500/30 hover:border-purple-400/40 cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>

                    <div className="relative z-10 p-4">
                      <div className="relative">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-48 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Quick Add Button */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              if (item.availability !== 'sold-out') {
                                addToCart(item);
                              }
                            }}
                            disabled={item.availability === 'sold-out'}
                            className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold rounded-xl overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                            <span className="relative z-10 font-black">
                              {item.availability === 'sold-out'
                                ? 'SOLD OUT'
                                : 'QUICK ADD'}
                            </span>
                          </button>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {item.featured && (
                            <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <Star className="w-2 h-2" />
                            </span>
                          )}
                          {item.discount && (
                            <span className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-2 py-1 rounded-full text-xs font-bold">
                              -{item.discount}%
                            </span>
                          )}
                        </div>

                        {/* Availability Badge */}
                        <div className="absolute top-2 right-2">
                          <span
                            className={`bg-${availability.color === 'cyber-primary' ? 'purple-500' : availability.color === 'cyber-secondary' ? 'purple-600' : 'gray-500'} text-white px-2 py-1 rounded-full text-xs font-bold`}
                          >
                            {availability.icon}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-black text-white text-lg mb-2 group-hover:text-purple-300 transition-colors">
                          {item.name}
                        </h3>

                        <div className="flex items-center justify-between">
                          {item.originalPrice ? (
                            <div className="flex items-center gap-1">
                              <span className="text-xl font-black text-purple-400">
                                {formatPrice(item.price)}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                {formatPrice(item.originalPrice)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xl font-black text-purple-400">
                              {formatPrice(item.price)}
                            </span>
                          )}

                          <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                            <Heart className="w-3 h-3 text-purple-300" />
                            <span>{formatNumber(item.likes)}</span>
                          </div>
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
              <div className="bg-[#0D0D0D] border border-purple-500/20 rounded-2xl overflow-hidden">
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
                      <Star className="w-6 h-6 text-purple-400" />
                    )}
                    <span className="text-purple-400 font-bold text-lg uppercase tracking-wider">
                      {selectedItem.category}
                    </span>
                  </div>

                  <h1 className="text-5xl font-black text-white mb-4">
                    {selectedItem.name}
                  </h1>

                  <p className="text-gray-300 text-lg leading-relaxed mb-6 font-bold">
                    {selectedItem.description}
                  </p>

                  {/* Pricing */}
                  <div className="flex items-center gap-4 mb-6">
                    {selectedItem.originalPrice ? (
                      <>
                        <span className="text-4xl font-black text-purple-400">
                          {formatPrice(selectedItem.price)}
                        </span>
                        <span className="text-xl text-gray-400 line-through">
                          {formatPrice(selectedItem.originalPrice)}
                        </span>
                        <span className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-full text-sm font-bold">
                          SAVE{' '}
                          {formatPrice(
                            selectedItem.originalPrice - selectedItem.price
                          )}
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl font-black text-purple-400">
                        {formatPrice(selectedItem.price)}
                      </span>
                    )}
                  </div>

                  {/* Availability */}
                  <div className="bg-[#0D0D0D] border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-purple-400/10 rounded-xl mb-6">
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        {getAvailabilityInfo(selectedItem).icon}
                        <span className="font-bold text-white">
                          {getAvailabilityInfo(selectedItem).text}
                        </span>
                        {selectedItem.estimatedRelease && (
                          <span className="text-gray-400 font-bold text-sm">
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
                    className="group relative w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold rounded-xl overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 text-xl mb-6"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                    <span className="relative z-10 font-black">
                      {selectedItem.availability === 'sold-out'
                        ? 'SOLD OUT'
                        : selectedItem.availability === 'pre-order'
                          ? 'PRE-ORDER NOW'
                          : 'ADD TO CART'}
                    </span>
                  </button>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0D0D0D] border border-purple-500/20 rounded-xl text-center">
                      <div className="p-4">
                        <div className="flex items-center justify-center gap-2 text-purple-300 mb-2">
                          <Heart className="w-5 h-5" />
                          <span className="text-2xl font-black">
                            {formatNumber(selectedItem.likes)}
                          </span>
                        </div>
                        <span className="text-gray-400 text-sm font-bold">
                          Likes
                        </span>
                      </div>
                    </div>
                    <div className="bg-[#0D0D0D] border border-purple-500/20 rounded-xl text-center">
                      <div className="p-4">
                        <div className="flex items-center justify-center gap-2 text-purple-400 mb-2">
                          <Eye className="w-5 h-5" />
                          <span className="text-2xl font-black">
                            {formatNumber(selectedItem.views)}
                          </span>
                        </div>
                        <span className="text-gray-400 text-sm font-bold">
                          Views
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="font-black text-white mb-4 text-xl">TAGS</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map(tag => (
                        <span
                          key={tag}
                          className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-bold border border-purple-500/30"
                        >
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

        {/* Store Philosophy */}
        {!selectedItem && (
          <div className="mt-16 bg-[#0D0D0D] border border-purple-500/20 rounded-2xl text-center transform hover:scale-105 transition-all duration-700 hover:shadow-2xl hover:shadow-purple-500/30 hover:border-purple-400/40">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
            <div className="p-8 relative z-10">
              <h3 className="text-4xl font-black text-white mb-4 flex items-center justify-center gap-3">
                <span className="text-4xl">🛍️</span>
                Store Philosophy
              </h3>
              <p className="text-gray-300 mb-6 text-xl max-w-4xl mx-auto leading-relaxed font-bold">
                Every piece in our collection represents the intersection of
                art, technology, and personal expression. From sustainable
                materials to cutting-edge design, we create merchandise that
                tells your story while pushing the boundaries of what wearable
                tech can become.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <div className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-bold border border-purple-500/30">
                  Premium Quality
                </div>
                <div className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-bold border border-purple-500/30">
                  Limited Editions
                </div>
                <div className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-bold border border-purple-500/30">
                  Sustainable Materials
                </div>
                <div className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-bold border border-purple-500/30">
                  Global Shipping
                </div>
                <div className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-bold border border-purple-500/30">
                  Secure Payments
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchSection;
