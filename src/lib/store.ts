import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  variantName?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  amount: number;
  items: CartItem[];
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Hold';
  trackingNumber?: string;
  shippingFee: number;
}

interface CartStore {
  items: CartItem[];
  purchasedTotal: number;
  orders: Order[];
  addItem: (product: Product) => void;
  removeItem: (productId: string, variantName?: string) => void;
  addPurchasedTotal: (amount: number) => void;
  addOrder: (order: Order) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      purchasedTotal: 0,
      orders: [],
      addItem: (product) => set((state) => {
        const existingItem = state.items.find((item) => 
          item.id === product.id && item.variantName === product.variantName
        );
        if (existingItem) {
          return {
            items: state.items.map((item) =>
              (item.id === product.id && item.variantName === product.variantName) 
                ? { ...item, quantity: item.quantity + 1 } : item
            ),
          };
        }
        return { items: [...state.items, { ...product, quantity: 1 }] };
      }),
      removeItem: (productId, variantName) => set((state) => ({
        items: state.items.filter((item) => 
          !(item.id === productId && item.variantName === variantName)
        ),
      })),
      addPurchasedTotal: (amount) => set((state) => ({
        purchasedTotal: state.purchasedTotal + amount
      })),
      addOrder: (order) => set((state) => ({
        orders: [order, ...state.orders]
      })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'pokecard-cart-storage-v2', // Increment version for schema change
    }
  )
);
