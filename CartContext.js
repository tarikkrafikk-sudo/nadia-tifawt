'use client';
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';

const CartContext = createContext(null);
const KEY = 'nt_cart_v1';

function reducer(state, action) {
  switch (action.type) {
    case 'hydrate':
      return action.items;
    case 'add': {
      const { product, quantity = 1 } = action;
      const found = state.find((i) => i.slug === product.slug);
      if (found) return state.map((i) => (i.slug === product.slug ? { ...i, quantity: Math.min(20, i.quantity + quantity) } : i));
      return [...state, { slug: product.slug, name: product.fr?.name || product.name, nameAr: product.nameAr, i18n: product.i18n, price: product.price, image: product.images?.[0], size: product.fr?.size || product.size, quantity }];
    }
    case 'update':
      return state.map((i) => (i.slug === action.slug ? { ...i, quantity: Math.max(1, Math.min(20, action.quantity)) } : i));
    case 'remove':
      return state.filter((i) => i.slug !== action.slug);
    case 'clear':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) dispatch({ type: 'hydrate', items: JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items, ready]);

  const value = useMemo(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);
    return {
      items, count, subtotal, ready, open, setOpen,
      add: (product, quantity = 1) => { if (!(product?.price > 0)) return; dispatch({ type: 'add', product, quantity }); setOpen(true); },
      update: (slug, quantity) => dispatch({ type: 'update', slug, quantity }),
      remove: (slug) => dispatch({ type: 'remove', slug }),
      clear: () => dispatch({ type: 'clear' }),
    };
  }, [items, ready, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans <CartProvider>');
  return ctx;
};
