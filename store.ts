import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  name: string;
  id: string;
  image: string;
  description?: string | null;
  quantity?: number | 1;
  unit_amount: number | null;
};

interface CartState {
  isOpen: boolean;
  cart: CartItem[];
  toggleCart: () => void;
  clearCart: () => void;
  addProduct: (item: CartItem) => void;
  removeProduct: (item: CartItem) => void;
  paymentIntent: string;
  setPaymentIntent: (val: string) => void;
  onCheckout: string;
  setCheckout: (val: string) => void;
  clientSecret: string;
  setClientSecret: (val: string) => void;
}

interface ThemeState {
  mode: 'light' | 'dark';
  toggleMode: (theme: 'light' | 'dark') => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      isOpen: false,
      paymentIntent: '',
      clientSecret: '',
      onCheckout: 'cart',
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      addProduct: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.id === item.id
          );

          if (existingItem) {
            const updatedCart = state.cart.map((cartItem) => {
              if (cartItem.id === item.id) {
                if (cartItem.quantity)
                  return { ...cartItem, quantity: cartItem.quantity + 1 };
              }
              return cartItem;
            });

            return { cart: updatedCart };
          } else {
            return { cart: [...state.cart, { ...item, quantity: 1 }] };
          }
        }),
      removeProduct: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.id === item.id
          );

          if (existingItem && existingItem.quantity! > 1) {
            const updatedCart = state.cart.map((cartItem) => {
              if (cartItem.id === item.id) {
                return { ...cartItem, quantity: cartItem.quantity! - 1 };
              }
              return cartItem;
            });

            return { cart: updatedCart };
          } else {
            const filteredCart = state.cart.filter(
              (cartItem) => cartItem.id !== item.id
            );
            return { cart: filteredCart };
          }
        }),
      setPaymentIntent: (val) => set((state) => ({ paymentIntent: val })),
      setCheckout: (val) => set((state) => ({ onCheckout: val })),
      setClientSecret: (val) => set((state) => ({ clientSecret: val })),
      clearCart: () => set((state) => ({ cart: [] })),
    }),
    { name: 'cart-store' }
  )
);

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      toggleMode: (theme) => set(() => ({ mode: theme })),
    }),
    { name: 'theme-store' }
  )
);
