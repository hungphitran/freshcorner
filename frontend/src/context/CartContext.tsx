import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  category?: {
    name: string;
    slug: string;
    themeKey?: string;
  };
  packageSize?: string;
  product_code?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function generateSessionId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [sessionId, setSessionId] = useState<string>("");
  const [items, setItems] = useState<CartItem[]>([]);

  // Initialize session & cart
  useEffect(() => {
    if (typeof window === "undefined") return;

    let sid = localStorage.getItem("sessionId");
    let createdAt = localStorage.getItem("sessionCreatedAt");
    const now = Date.now();

    if (!sid || !createdAt || now - parseInt(createdAt) > THIRTY_DAYS_MS) {
      sid = generateSessionId();
      localStorage.setItem("sessionId", sid);
      localStorage.setItem("sessionCreatedAt", now.toString());
    }

    setSessionId(sid!);

    const stored = localStorage.getItem(`cart_${sid}`);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        // ignore parse error
      }
    }
  }, []);

  // Persist cart whenever items/sessionId change
  useEffect(() => {
    if (!sessionId || typeof window === "undefined") return;
    localStorage.setItem(`cart_${sessionId}`, JSON.stringify(items));
  }, [items, sessionId]);

  const addItem = (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + quantity } : p
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity } : p)));
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}; 