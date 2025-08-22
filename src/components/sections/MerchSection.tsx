import React, { useCallback, useState } from 'react';
import { MerchProduct } from '@/types';
import { useCartStore, useCartCount } from '@/store/cartStore';
import {
  ProductCard,
  CartSidebar,
  ProductDetailModal,
} from '@/components/merch';
import {
  merchProducts,
  merchCategories,
  getFeaturedProducts,
} from '@/utils/merchData';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Zap, Shield } from 'lucide-react';

export const MerchSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<MerchProduct | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cartCount = useCartCount();
  const { openCart } = useCartStore();

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === 'all'
      ? merchProducts
      : merchProducts.filter(
          product =>
            product.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  const featuredProducts = getFeaturedProducts();

  const handleViewDetails = useCallback((product: MerchProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-mono text-cyan-400 mb-4">
                  Merchandise Store
                </h1>
                <p className="text-lg text-cyan-300 mb-4">
                  Support the creative journey with exclusive merchandise and
                  digital art pieces.
                </p>
              </div>

              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative border border-cyan-400 text-cyan-400 p-3 hover:bg-cyan-400 hover:text-black transition-all duration-300 font-mono"
              >
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-magenta-400 text-black text-xs font-mono px-2 py-1 rounded-full min-w-[20px] text-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 border border-gray-700 p-4 bg-black bg-opacity-30">
                <Zap className="text-cyan-400" size={24} />
                <div>
                  <div className="font-mono text-cyan-400 text-sm">
                    Free Shipping
                  </div>
                  <div className="text-gray-400 text-xs">
                    On orders over $50
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 border border-gray-700 p-4 bg-black bg-opacity-30">
                <Star className="text-cyan-400" size={24} />
                <div>
                  <div className="font-mono text-cyan-400 text-sm">
                    Premium Quality
                  </div>
                  <div className="text-gray-400 text-xs">
                    Handpicked materials
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 border border-gray-700 p-4 bg-black bg-opacity-30">
                <Shield className="text-cyan-400" size={24} />
                <div>
                  <div className="font-mono text-cyan-400 text-sm">
                    Secure Payment
                  </div>
                  <div className="text-gray-400 text-xs">
                    SSL encrypted checkout
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Products Section */}
          {selectedCategory === 'all' && featuredProducts.length > 0 && (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-mono text-magenta-400 mb-6">
                Featured Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={handleViewDetails}
                    className="animate-fade-in"
                    style={
                      {
                        animationDelay: `${index * 0.1}s`,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Category Filter */}
          <div className="flex flex-wrap gap-4 mb-8">
            {merchCategories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 font-mono text-sm border transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'border-magenta-400 bg-magenta-400 text-black'
                    : 'border-magenta-400 text-magenta-400 hover:bg-magenta-400 hover:text-black'
                }`}
              >
                {category.name.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            layout
          >
            <AnimatePresence mode="wait">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleViewDetails}
                  className="animate-fade-in"
                  style={
                    {
                      animationDelay: `${index * 0.05}s`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ShoppingBag className="mx-auto text-gray-600 mb-4" size={64} />
              <h3 className="text-xl font-mono text-gray-400 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                Try selecting a different category
              </p>
            </motion.div>
          )}

          {/* Store Info */}
          <motion.div
            className="mt-16 border-t border-gray-700 pt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-mono text-cyan-400 mb-4">
                  Shipping & Returns
                </h3>
                <div className="text-gray-300 text-sm space-y-2">
                  <p>Free shipping on orders over $50</p>
                  <p>30-day return policy</p>
                  <p>International shipping available</p>
                </div>
              </div>
              <div>
                <h3 className="font-mono text-cyan-400 mb-4">
                  Quality Guarantee
                </h3>
                <div className="text-gray-300 text-sm space-y-2">
                  <p>Premium materials only</p>
                  <p>Eco-friendly packaging</p>
                  <p>Satisfaction guaranteed</p>
                </div>
              </div>
              <div>
                <h3 className="font-mono text-cyan-400 mb-4">Support</h3>
                <div className="text-gray-300 text-sm space-y-2">
                  <p>24/7 customer support</p>
                  <p>Size guide available</p>
                  <p>Secure SSL checkout</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};
