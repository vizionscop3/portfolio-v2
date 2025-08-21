import { MerchProduct } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/merchData';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

interface ProductDetailModalProps {
  product: MerchProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>();
  const [selectedColor, setSelectedColor] = useState<string>();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addItem, openCart } = useCartStore();

  // Reset selections when product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setSelectedSize(product.sizes?.[0]);
      setSelectedColor(product.colors?.[0]);
      setQuantity(1);
    }
  }, [product]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  const handleAddToCart = () => {
    if (!product || !product.inStock) return;

    // Add validation for required selections
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }

    addItem(product, {
      size: selectedSize,
      color: selectedColor,
      quantity,
    });

    openCart();
    onClose();
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-w-6xl w-full max-h-[90vh] bg-gradient-to-br from-purple-900 to-black border border-cyan-400 overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-cyan-400">
              <div>
                <h2 className="text-2xl font-mono text-cyan-400">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-400">
                  {product.category} • SKU: {product.id}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-cyan-400 hover:text-white transition-colors p-2"
                title="Close"
              >
                <X size={24} />
              </button>
            </div>

            <div
              className="overflow-y-auto"
              style={{ maxHeight: 'calc(90vh - 80px)' }}
            >
              <div className="grid md:grid-cols-2 gap-8 p-6">
                {/* Product Images */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative aspect-square overflow-hidden border border-gray-700">
                    <motion.img
                      key={selectedImage}
                      src={product.images[selectedImage] || product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Status Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.featured && (
                        <div className="bg-cyan-400 text-black px-3 py-1 text-sm font-mono">
                          FEATURED
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="bg-red-600 text-white px-3 py-1 text-sm font-mono">
                          OUT OF STOCK
                        </div>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                        isWishlisted
                          ? 'bg-red-500 text-white'
                          : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
                      }`}
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      title="Add to Wishlist"
                    >
                      <Heart
                        size={20}
                        fill={isWishlisted ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>

                  {/* Thumbnail Images */}
                  {product.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition-colors ${
                            selectedImage === index
                              ? 'border-cyan-400'
                              : 'border-gray-600 hover:border-gray-400'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  {/* Price & Rating */}
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-mono text-magenta-400">
                      {formatPrice(product.price, product.currency)}
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className="text-yellow-400"
                          fill="currentColor"
                        />
                      ))}
                      <span className="text-sm text-gray-400 ml-1">(4.8)</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-gray-300 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Size Selection */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <label className="block text-sm font-mono text-gray-400 mb-2">
                        Size:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 border font-mono text-sm transition-all ${
                              selectedSize === size
                                ? 'border-cyan-400 bg-cyan-400 text-black'
                                : 'border-gray-600 text-gray-400 hover:border-cyan-400 hover:text-cyan-400'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color Selection */}
                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <label className="block text-sm font-mono text-gray-400 mb-2">
                        Color:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 border font-mono text-sm transition-all ${
                              selectedColor === color
                                ? 'border-cyan-400 bg-cyan-400 text-black'
                                : 'border-gray-600 text-gray-400 hover:border-cyan-400 hover:text-cyan-400'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">
                      Quantity:
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 border border-gray-600 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors flex items-center justify-center"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="font-mono text-white px-4">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 border border-gray-600 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Stock Info */}
                  {product.inStock && product.stock && (
                    <div
                      className={`text-sm font-mono ${
                        product.stock < 10
                          ? 'text-orange-400'
                          : 'text-green-400'
                      }`}
                    >
                      {product.stock < 10
                        ? `Only ${product.stock} left in stock!`
                        : `${product.stock} in stock`}
                    </div>
                  )}

                  {/* Add to Cart */}
                  <motion.button
                    className={`w-full font-mono py-3 flex items-center justify-center gap-2 transition-all duration-300 ${
                      product.inStock
                        ? 'bg-gradient-to-r from-cyan-400 to-magenta-400 text-black hover:from-cyan-300 hover:to-magenta-300'
                        : 'border border-gray-600 text-gray-600 cursor-not-allowed'
                    }`}
                    disabled={!product.inStock}
                    onClick={handleAddToCart}
                    whileHover={product.inStock ? { scale: 1.02 } : {}}
                    whileTap={product.inStock ? { scale: 0.98 } : {}}
                  >
                    <ShoppingCart size={20} />
                    {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
                  </motion.button>

                  {/* Features */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                    <div className="text-center">
                      <Truck className="text-cyan-400 mx-auto mb-2" size={24} />
                      <div className="text-xs font-mono text-gray-400">
                        Free Shipping
                      </div>
                      <div className="text-xs text-gray-500">Over $50</div>
                    </div>
                    <div className="text-center">
                      <RotateCcw
                        className="text-cyan-400 mx-auto mb-2"
                        size={24}
                      />
                      <div className="text-xs font-mono text-gray-400">
                        Easy Returns
                      </div>
                      <div className="text-xs text-gray-500">30 Days</div>
                    </div>
                    <div className="text-center">
                      <Shield
                        className="text-cyan-400 mx-auto mb-2"
                        size={24}
                      />
                      <div className="text-xs font-mono text-gray-400">
                        Secure Payment
                      </div>
                      <div className="text-xs text-gray-500">SSL Encrypted</div>
                    </div>
                  </div>

                  {/* Specifications */}
                  {product.specifications && (
                    <div>
                      <h4 className="text-sm font-mono text-gray-400 mb-3">
                        Specifications:
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(product.specifications).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-gray-400">{key}:</span>
                              <span className="text-gray-300">{value}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs font-mono text-magenta-400 bg-magenta-400 bg-opacity-20 px-2 py-1 border border-magenta-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
