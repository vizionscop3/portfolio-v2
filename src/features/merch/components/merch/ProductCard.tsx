import { MerchProduct } from '../../../../shared/types';
import { useCartStore } from '../../../../app/store/store/cartStore';
import { formatPrice } from '../../../../shared/utils/merchData';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import React, { useState } from 'react';

interface ProductCardProps {
  product: MerchProduct;
  onViewDetails?: (product: MerchProduct) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  className = '',
  style,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>();
  const [selectedColor, setSelectedColor] = useState<string>();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addItem, openCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!product.inStock) return;

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
      quantity: 1,
    });

    openCart();
  };

  const handleViewDetails = () => {
    onViewDetails?.(product);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <motion.div
      className={`group cursor-pointer ${className}`}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails}
    >
      <div className="relative overflow-hidden border border-magenta-500 bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-500">
        {/* Product Image */}
        <div className="relative h-64 overflow-hidden">
          <motion.img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          {/* Image Overlay */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-3">
              <motion.button
                className="bg-cyan-400 text-black p-2 rounded-full hover:bg-cyan-300 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={e => {
                  e.stopPropagation();
                  handleViewDetails();
                }}
                title="View Details"
              >
                <Eye size={16} />
              </motion.button>

              <motion.button
                className={`p-2 rounded-full transition-colors ${
                  isWishlisted
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleWishlist}
                title="Add to Wishlist"
              >
                <Heart
                  size={16}
                  fill={isWishlisted ? 'currentColor' : 'none'}
                />
              </motion.button>
            </div>
          </motion.div>

          {/* Status Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.featured && (
              <motion.div
                className="bg-cyan-400 text-black px-2 py-1 text-xs font-mono"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                FEATURED
              </motion.div>
            )}
            {!product.inStock && (
              <motion.div
                className="bg-red-600 text-white px-2 py-1 text-xs font-mono"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                OUT OF STOCK
              </motion.div>
            )}
          </div>

          {/* Hover Glow Effect */}
          <motion.div
            className="absolute inset-0 border-2 border-cyan-400"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isHovered ? 0.3 : 0,
              boxShadow: isHovered
                ? '0 0 20px rgba(0, 255, 255, 0.5)'
                : '0 0 0px rgba(0, 255, 255, 0)',
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <motion.h3
              className="text-lg font-mono text-cyan-300 group-hover:text-cyan-400 transition-colors"
              animate={{
                color: isHovered ? '#00FFFF' : '#67E8F9',
              }}
            >
              {product.name}
            </motion.h3>
            <span className="text-magenta-400 font-mono font-bold">
              {formatPrice(product.price, product.currency)}
            </span>
          </div>

          {/* Category */}
          <div className="text-xs font-mono text-gray-400 mb-2">
            {product.category}
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-3">
              <label className="text-xs font-mono text-gray-400 mb-1 block">
                Size:
              </label>
              <div className="flex flex-wrap gap-1">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                    className={`text-xs font-mono px-2 py-1 border transition-all ${
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
            <div className="mb-3">
              <label className="text-xs font-mono text-gray-400 mb-1 block">
                Color:
              </label>
              <div className="flex flex-wrap gap-1">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedColor(color);
                    }}
                    className={`text-xs font-mono px-2 py-1 border transition-all ${
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

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-xs font-mono text-magenta-400 bg-magenta-400 bg-opacity-20 px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stock Info */}
          {product.inStock && product.stock && product.stock < 10 && (
            <div className="text-xs font-mono text-orange-400 mb-3">
              Only {product.stock} left in stock!
            </div>
          )}

          {/* Add to Cart Button */}
          <motion.button
            className={`w-full font-mono py-2 flex items-center justify-center gap-2 transition-all duration-300 ${
              product.inStock
                ? 'border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black'
                : 'border border-gray-600 text-gray-600 cursor-not-allowed'
            }`}
            disabled={!product.inStock}
            onClick={handleAddToCart}
            whileHover={product.inStock ? { scale: 1.02 } : {}}
            whileTap={product.inStock ? { scale: 0.98 } : {}}
          >
            <ShoppingCart size={16} />
            {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
