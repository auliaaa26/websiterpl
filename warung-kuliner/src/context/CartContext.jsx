import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Tambah item ke cart (dari Home modal atau DetailMenu)
  const addToCart = (menu, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === menu.id);
      if (existing) {
        return prev.map(item =>
          item.id === menu.id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      return [...prev, { ...menu, qty, notes: '' }];
    });
  };

  // Update qty di OrderSummary
  const updateQty = (id, delta) => {
    setCartItems(prev =>
      prev
        .map(item => item.id === id ? { ...item, qty: item.qty + delta } : item)
        .filter(item => item.qty > 0) // hapus kalau qty jadi 0
    );
  };

  // Update notes di OrderSummary
  const updateNotes = (id, notes) => {
    setCartItems(prev =>
      prev.map(item => item.id === id ? { ...item, notes } : item)
    );
  };
  const clearCart = () => setCartItems([]);

  const totalCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const totalHarga = cartItems.reduce((sum, item) => {
    const harga = item.hargaNum ?? (typeof item.harga === 'string' ? parseInt(item.harga.replace(/\D/g, '')) : Number(item.harga));
    return sum + harga * item.qty;
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQty, updateNotes, totalCount, totalHarga, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);