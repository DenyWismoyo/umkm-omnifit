import { create } from "zustand";
import { Product, CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  globalDiscount: number; // absolute amount
  taxPercentage: number;
  
  // Actions
  addToCart: (product: Product, quantity?: number, notes?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  setGlobalDiscount: (discount: number) => void;
  setTaxPercentage: (tax: number) => void;
  setItems: (items: CartItem[]) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  globalDiscount: 0,
  taxPercentage: 0,

  addToCart: (product, quantity = 1, notes = "") =>
    set((state) => {
      const existingIndex = state.items.findIndex(
        (i) => i.product.id === product.id
      );

      if (existingIndex !== -1) {
        const item = state.items[existingIndex];
        const newQty = item.quantity + quantity;
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...item,
          quantity: newQty,
          subtotal: newQty * item.product.sellingPrice - (item.discount || 0),
          notes: item.notes ? item.notes : notes
        };
        return { items: newItems };
      }

      const newItem: CartItem = {
        product,
        quantity,
        discount: 0,
        subtotal: quantity * product.sellingPrice,
        notes,
      };
      
      return { items: [...state.items, newItem] };
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),

  updateQuantity: (productId, delta) =>
    set((state) => {
      return {
        items: state.items.map((item) => {
          if (item.product.id === productId) {
            const newQuantity = Math.max(1, item.quantity + delta);
            return { 
              ...item, 
              quantity: newQuantity,
              subtotal: newQuantity * item.product.sellingPrice - (item.discount || 0)
            };
          }
          return item;
        }),
      };
    }),

  setGlobalDiscount: (globalDiscount) => set({ globalDiscount }),
  
  setTaxPercentage: (taxPercentage) => set({ taxPercentage }),

  setItems: (items) => set({ items }),

  clearCart: () => set({ items: [], globalDiscount: 0 }),
}));
