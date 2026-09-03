import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState({}); // { productId: qty }

  function add(productId, stock) {
    setItems((prev) => {
      const current = prev[productId] || 0;
      const max = Number.isFinite(stock) ? stock : Infinity;
      if (max <= 0 || current >= max) return prev;
      return { ...prev, [productId]: current + 1 };
    });
  }
  function changeQty(productId, delta, stock) {
    setItems((prev) => {
      const current = prev[productId] || 0;
      const next = current + delta;
      const max = Number.isFinite(stock) ? stock : Infinity;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      if (next > max) return prev;
      return { ...prev, [productId]: next };
    });
  }
  function remove(productId) {
    setItems((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }
  function clear() {
    setItems({});
  }

  const count = Object.values(items).reduce((a, b) => a + b, 0);

  return (
    <CartContext.Provider value={{ items, add, changeQty, remove, clear, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
