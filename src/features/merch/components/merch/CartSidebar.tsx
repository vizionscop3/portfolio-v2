import {
  useCartStore,
  useCartItems,
  useCartTotals,
} from '../../../../app/store/store/cartStore';
import { formatPrice } from '../../../../shared/utils/merchData';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';
import React from 'react';

export const CartSidebar: React.FC = () => {
  const { isOpen, closeCart, updateQuantity, removeItem } = useCartStore();
  const items = useCartItems();
  const { subtotal, shipping, tax, total } = useCartTotals();

  const handleQuantityChange = (
    productId: string,
    newQuantity: number,
    size?: string,
    color?: string
  ) => {
    updateQuantity(productId, newQuantity, size, color);
  };

  const handleRemoveItem = (
    productId: string,
    size?: string,
    color?: string
  ) => {
    removeItem(productId, size, color);
  };

  const handleCheckout = () => {
    // For now, just show an alert. In a real app, this would integrate with a payment processor
    alert(
      'Checkout functionality would be integrated with a payment processor like Stripe, PayPal, or Square.'
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-purple-900 to-black border-l border-cyan-400 z-50 overflow-hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-cyan-400">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-cyan-400" size={24} />
                  <h2 className="text-xl font-mono text-cyan-400">
                    Shopping Cart
                  </h2>
                  {items.length > 0 && (
                    <span className="bg-magenta-400 text-black font-mono text-sm px-2 py-1 rounded">
                      {items.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </div>

                <button
                  onClick={closeCart}
                  className="text-cyan-400 hover:text-white transition-colors p-1"
                  title="Close cart"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <ShoppingBag className="text-gray-600" size={64} />
                    <h3 className="text-lg font-mono text-gray-400 mt-4 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Add some products to get started!
                    </p>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    <AnimatePresence>
                      {items.map((item, index) => (
                        <motion.div
                          key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                          className="border border-gray-700 p-3 bg-black bg-opacity-30"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="flex gap-3">
                            {/* Product Image */}
                            <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-mono text-cyan-300 truncate">
                                {item.product.name}
                              </h4>

                              <div className="text-xs text-gray-400 mt-1">
                                {formatPrice(
                                  item.product.price,
                                  item.product.currency
                                )}
                                {item.selectedSize &&
                                  ` • Size: ${item.selectedSize}`}
                                {item.selectedColor &&
                                  ` • Color: ${item.selectedColor}`}
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.product.id,
                                        item.quantity - 1,
                                        item.selectedSize,
                                        item.selectedColor
                                      )
                                    }
                                    className="w-6 h-6 flex items-center justify-center border border-gray-600 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus size={12} />
                                  </button>

                                  <span className="text-sm font-mono text-white px-2">
                                    {item.quantity}
                                  </span>

                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.product.id,
                                        item.quantity + 1,
                                        item.selectedSize,
                                        item.selectedColor
                                      )
                                    }
                                    className="w-6 h-6 flex items-center justify-center border border-gray-600 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>

                                <button
                                  onClick={() =>
                                    handleRemoveItem(
                                      item.product.id,
                                      item.selectedSize,
                                      item.selectedColor
                                    )
                                  }
                                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>

                            {/* Item Total */}
                            <div className="text-sm font-mono text-magenta-400 flex-shrink-0">
                              {formatPrice(
                                item.product.price * item.quantity,
                                item.product.currency
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Cart Summary & Checkout */}
              {items.length > 0 && (
                <motion.div
                  className="border-t border-cyan-400 p-4 bg-black bg-opacity-50"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Totals */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="text-white font-mono">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Shipping:</span>
                      <span className="text-white font-mono">
                        {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tax:</span>
                      <span className="text-white font-mono">
                        {formatPrice(tax)}
                      </span>
                    </div>

                    <div className="flex justify-between text-lg font-mono border-t border-gray-600 pt-2">
                      <span className="text-cyan-400">Total:</span>
                      <span className="text-cyan-400">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  {/* Free Shipping Notice */}
                  {subtotal < 50 && (
                    <div className="text-xs text-yellow-400 mb-3 p-2 border border-yellow-400 bg-yellow-400 bg-opacity-10">
                      Add {formatPrice(50 - subtotal)} more for free shipping!
                    </div>
                  )}

                  {/* Checkout Button */}
                  <motion.button
                    className="w-full bg-gradient-to-r from-cyan-400 to-magenta-400 text-black font-mono py-3 flex items-center justify-center gap-2 hover:from-cyan-300 hover:to-magenta-300 transition-all duration-300"
                    onClick={handleCheckout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CreditCard size={18} />
                    SECURE CHECKOUT
                  </motion.button>

                  {/* Security Notice */}
                  <div className="text-xs text-gray-500 text-center mt-2">
                    🔒 Secure SSL encrypted checkout
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
