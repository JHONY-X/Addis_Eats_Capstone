"use client";

import Link from "next/link";
import { useCart } from "./providers";

export default function CartBadge() {
  const { itemCount } = useCart();
  return (
    <Link href="/checkout" className="lux-bag-btn" aria-label={`Cart, ${itemCount} items`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      <span className="cart-label">BAG</span>
      {itemCount > 0 && <span className="lux-bag-count">{itemCount}</span>}
    </Link>
  );
}
