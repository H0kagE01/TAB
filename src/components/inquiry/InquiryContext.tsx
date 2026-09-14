'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Product } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingBag, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export interface CartItem {
  product: Product;
  quantity: number;
  grindOption?: string;
  addedAt: number;
}

interface FlyingItem {
  id: number;
  product: Product;
  startX: number;
  startY: number;
}

interface ToastNotification {
  id: number;
  product: Product;
  quantity: number;
  grindOption?: string;
}

interface CartContextType {
  isOpen: boolean;
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
  selectedProduct: Product | null;
  cartBounceKey: number;
  addToCart: (
    product: Product,
    quantity?: number,
    grindOption?: string,
    openAfterAdd?: boolean,
    originElement?: HTMLElement | null
  ) => void;
  updateQuantity: (productId: string, quantity: number, grindOption?: string) => void;
  removeFromCart: (productId: string, grindOption?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openInquiry: (
    product?: Product | null,
    quantity?: number,
    grindOption?: string,
    originElement?: HTMLElement | null
  ) => void;
  closeInquiry: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'konfetnica_cart_items';

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [cartBounceKey, setCartBounceKey] = useState(0);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load cart from storage:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save cart to LocalStorage whenever items change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to storage:', e);
    }
  }, [items, isHydrated]);

  // Compute total item count
  const totalCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  // Compute total price
  const totalPrice = useMemo(() => {
    return items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [items]);

  // Add item to cart with flying animation & toast
  const addToCart = (
    product: Product,
    quantity: number = 1,
    grindOption?: string,
    openAfterAdd: boolean = false,
    originElement?: HTMLElement | null
  ) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.grindOption === grindOption
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            product,
            quantity,
            grindOption,
            addedAt: Date.now(),
          },
        ];
      }
    });

    setSelectedProduct(product);

    // Trigger Flying Animation if origin position is provided
    if (originElement && typeof window !== 'undefined') {
      const rect = originElement.getBoundingClientRect();
      const newFlyId = Date.now() + Math.random();
      setFlyingItems((prev) => [
        ...prev,
        {
          id: newFlyId,
          product,
          startX: rect.left + rect.width / 2,
          startY: rect.top + rect.height / 2,
        },
      ]);

      // Remove flying item after animation completes
      setTimeout(() => {
        setFlyingItems((prev) => prev.filter((item) => item.id !== newFlyId));
      }, 900);
    }

    // Trigger header bounce
    setTimeout(() => {
      setCartBounceKey((prev) => prev + 1);
    }, 450);

    // Show stylish Toast notification if drawer is not opened immediately
    if (!openAfterAdd) {
      const toastId = Date.now();
      setToast({
        id: toastId,
        product,
        quantity,
        grindOption,
      });

      // Auto-hide toast after 3.5s
      setTimeout(() => {
        setToast((current) => (current?.id === toastId ? null : current));
      }, 3500);
    } else {
      setIsOpen(true);
    }
  };

  // Update item quantity
  const updateQuantity = (productId: string, quantity: number, grindOption?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, grindOption);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId && item.grindOption === grindOption) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  // Remove item from cart
  const removeFromCart = (productId: string, grindOption?: string) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.product.id === productId && item.grindOption === grindOption)
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setItems([]);
  };

  // Open cart drawer
  const openCart = () => {
    setToast(null);
    setIsOpen(true);
  };

  // Close cart drawer
  const closeCart = () => {
    setIsOpen(false);
  };

  // Legacy alias for openInquiry
  const openInquiry = (
    product: Product | null = null,
    quantity: number = 1,
    grindOption?: string,
    originElement?: HTMLElement | null
  ) => {
    if (product) {
      addToCart(product, quantity, grindOption, false, originElement);
    } else {
      setIsOpen(true);
    }
  };

  const closeInquiry = () => {
    closeCart();
  };

  return (
    <CartContext.Provider
      value={{
        isOpen,
        items,
        totalCount,
        totalPrice,
        selectedProduct,
        cartBounceKey,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        openCart,
        closeCart,
        openInquiry,
        closeInquiry,
      }}
    >
      {children}

      {/* ======================================================== */}
      {/* 1. FLYING ITEM ANIMATION PARTICLES                       */}
      {/* ======================================================== */}
      <AnimatePresence>
        {flyingItems.map((fly) => {
          // Target is the top right header cart button location
          const targetX = typeof window !== 'undefined' ? window.innerWidth - 64 : 500;
          const targetY = 28;

          return (
            <motion.div
              key={fly.id}
              initial={{
                position: 'fixed',
                left: fly.startX - 24,
                top: fly.startY - 24,
                width: 48,
                height: 48,
                scale: 1,
                opacity: 1,
                zIndex: 99999,
                pointerEvents: 'none',
              }}
              animate={{
                left: [fly.startX - 24, (fly.startX + targetX) / 2 - 40, targetX - 16],
                top: [fly.startY - 24, Math.min(fly.startY, targetY) - 70, targetY],
                scale: [1, 1.3, 0.35],
                opacity: [1, 1, 0.8, 0],
              }}
              transition={{
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-full bg-gradient-to-tr from-[#B88B58] to-amber-300 p-1 shadow-[0_0_25px_rgba(217,167,106,0.9)] border border-white/60 flex items-center justify-center overflow-hidden"
            >
              {fly.product.images[0] ? (
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={fly.product.images[0]}
                    alt={fly.product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <ShoppingBag className="h-5 w-5 text-[#0E0A08]" />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 2. ELEGANT CART TOAST NOTIFICATION                       */}
      {/* ======================================================== */}
      <AnimatePresence>
        {toast && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-6 right-6 z-[99999] max-w-sm w-[calc(100vw-3rem)] p-4 rounded-2xl bg-[#17100B] border-2 border-[#B88B58]/60 shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-2xl text-white space-y-3 pointer-events-auto"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D9A76A]">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Добавлено в корзину!</span>
              </div>

              <button
                type="button"
                onClick={() => setToast(null)}
                className="p-1 rounded-full text-[#8E8276] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Закрыть уведомление"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0">
                {toast.product.images[0] ? (
                  <Image
                    src={toast.product.images[0]}
                    alt={toast.product.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <ShoppingBag className="h-5 w-5 text-[#8E8276] m-auto" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">
                  {toast.product.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-[#A89D91] mt-0.5">
                  <span>
                    {toast.quantity} шт. • {formatPrice(toast.product.price * toast.quantity)}
                  </span>
                  {toast.grindOption && (
                    <span className="truncate text-[#D9A76A]">({toast.grindOption})</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
              <span className="text-[11px] text-[#8E8276]">
                Всего в корзине: <strong className="text-white font-mono">{totalCount} шт.</strong>
              </span>

              <button
                type="button"
                onClick={openCart}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#B88B58] text-[#0E0A08] text-xs font-bold shadow hover:bg-[#CBA06E] transition-all cursor-pointer hover:scale-105"
              >
                <span>Корзина</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within an InquiryProvider');
  }
  return context;
}

export const useInquiry = useCart;
