import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

export const MAX_QUANTITY = 999;

interface CartState {
  items: CartItem[];
  addItem: (productSlug: string, planId: string, quantity: number) => void;
  setQuantity: (productSlug: string, planId: string, quantity: number) => void;
  removeItem: (productSlug: string, planId: string) => void;
  clear: () => void;
}

function clampQuantity(quantity: number): number {
  return Math.min(MAX_QUANTITY, Math.max(1, Math.floor(quantity)));
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem(productSlug, planId, quantity) {
        set((state) => {
          const existing = state.items.find(
            (item) => item.productSlug === productSlug && item.planId === planId,
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item === existing
                  ? {
                      ...item,
                      quantity: clampQuantity(item.quantity + quantity),
                    }
                  : item,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { productSlug, planId, quantity: clampQuantity(quantity) },
            ],
          };
        });
      },

      setQuantity(productSlug, planId, quantity) {
        set((state) => ({
          items: state.items.map((item) =>
            item.productSlug === productSlug && item.planId === planId
              ? { ...item, quantity: clampQuantity(quantity) }
              : item,
          ),
        }));
      },

      removeItem(productSlug, planId) {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productSlug === productSlug && item.planId === planId
              ),
          ),
        }));
      },

      clear() {
        set({ items: [] });
      },
    }),
    { name: "nova.cart" },
  ),
);

export function useCartCount(): number {
  return useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
}
