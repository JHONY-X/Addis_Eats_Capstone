"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CartBadge from "./CartBadge";
import SignOutButton from "./SignOutButton";

export default function SiteHeader({ session }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  function closeMenus() {
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
  }

  return (
    <header className="site-header">
      <button
        aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={mobileMenuOpen}
        aria-controls="site-navigation"
        className="mobile-menu-toggle"
        onClick={() => setMobileMenuOpen((open) => !open)}
        type="button"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {mobileMenuOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      <Link aria-label="Addis Eats home" className="brand" href="/" onClick={closeMenus}>
        <Image alt="Addis Eats, good food and real flavors" height={56} priority src="/addis-eats-logo.svg" width={250} />
      </Link>

      <nav
        aria-label="Main navigation"
        className={`site-navigation ${mobileMenuOpen ? "is-open" : ""}`}
        id="site-navigation"
      >
        <Link href="/menu" onClick={closeMenus}>Menu</Link>
        <Link href="/favorites" onClick={closeMenus}>Favorites</Link>
        <Link href="/checkout" onClick={closeMenus}>Checkout</Link>
        {session?.role === "staff" && (
          <>
            <Link href="/dashboard" onClick={closeMenus}>Dashboard</Link>
            <Link href="/kitchen" onClick={closeMenus}>Kitchen</Link>
            <Link href="/orders" onClick={closeMenus}>Orders</Link>
          </>
        )}
      </nav>

      <div className="site-header-tools">
        <CartBadge />
        <div className="account-menu">
          {session ? (
            <>
              <button
                aria-expanded={accountMenuOpen}
                aria-haspopup="true"
                className="account-button"
                onClick={() => setAccountMenuOpen((open) => !open)}
                type="button"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
                </svg>
                <span>{session.name}</span>
                <svg aria-hidden="true" className="account-chevron" viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="m2 4 4 4 4-4" />
                </svg>
              </button>
              {accountMenuOpen && (
                <div className="account-dropdown">
                  <span className="account-dropdown-name">{session.name}</span>
                  <SignOutButton />
                </div>
              )}
            </>
          ) : (
            <Link className="account-button" href="/signin" onClick={closeMenus}>
              <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
              </svg>
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}