import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, MerchProduct } from '@/types';
import {
  calculateSubtotal,
  calculateShipping,
  calculateTax,
  calculateTotal,
} from '@/utils/merchData';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (
    product: MerchProduct,
    options?: { size?: string; color?: string; quantity?: number }
  ) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed values
  getItemCount: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  getTax: () => number;
  getTotal: () => number;

  // Helper functions
  getCartItem: (
    productId: string,
    size?: string,
    color?: string
  ) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, options = {}) => {
        const { size, color, quantity = 1 } = options;

        set(state => {
          const existingItemIndex = state.items.findIndex(
            item =>
              item.product.id === product.id &&
              item.selectedSize === size &&
              item.selectedColor === color
          );

          if (existingItemIndex >= 0) {
            // Update existing item
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += quantity;
            return { items: updatedItems };
          } else {
            // Add new item
            const newItem: CartItem = {
              product,
              quantity,
              selectedSize: size,
              selectedColor: color,
            };
            return { items: [...state.items, newItem] };
          }
        });
      },

      removeItem: (productId, size, color) => {
        set(state => ({
          items: state.items.filter(
            item =>
              !(
                item.product.id === productId &&
                item.selectedSize === size &&
                item.selectedColor === color
              )
          ),
        }));
      },

      updateQuantity: (productId, quantity, size, color) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }

        set(state => ({
          items: state.items.map(item =>
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return calculateSubtotal(get().items);
      },

      getShipping: () => {
        return calculateShipping(get().getSubtotal());
      },

      getTax: () => {
        return calculateTax(get().getSubtotal());
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShipping();
        const tax = get().getTax();
        return calculateTotal(subtotal, shipping, tax);
      },

      getCartItem: (productId, size, color) => {
        return get().items.find(
          item =>
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
        );
      },
    }),
    {
      name: 'cart-storage',
      partialize: state => ({ items: state.items }),
    }
  )
);

// Custom hooks for easier usage
export const useCartItems = () => useCartStore(state => state.items);
export const useCartCount = () => useCartStore(state => state.getItemCount());
export const useCartIsOpen = () => useCartStore(state => state.isOpen);
export const useCartTotals = () => {
  const store = useCartStore();
  return {
    subtotal: store.getSubtotal(),
    shipping: store.getShipping(),
    tax: store.getTax(),
    total: store.getTotal(),
  };
};
