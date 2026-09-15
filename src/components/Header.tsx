import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Search,
  Clock,
  PhoneCall,
  ShieldCheck,
  Bike,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenTracker: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  onOpenAdmin,
  onOpenTracker,
  searchQuery,
  setSearchQuery
}) => {
  const { cartItemCount, cartTotal, storeSettings, activeOrder, isAdminAuthenticated, unreadOrdersCount } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {storeSettings.isOpen ? 'OPEN NOW' : 'CLOSED'}
            </span>
            <span className="truncate hidden sm:inline">{storeSettings.noticeBanner}</span>
            <span className="truncate sm:hidden">⚡ 12-15 Min Delivery</span>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-slate-300">
            <a
              href={`https://wa.me/${storeSettings.ownerPhone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
              title="Direct WhatsApp Order / Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-semibold">{storeSettings.ownerPhone}</span>
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">
                {isAdminAuthenticated ? 'Admin Panel' : 'Store Login'}
              </span>
              {unreadOrdersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                2X
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 leading-none">
                    2EXPERT
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                    Est. 2026
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 truncate max-w-[180px] sm:max-w-xs">
                  Jo saman chahiye, bas message kariye.
                </span>
              </div>
            </a>
          </div>

          {/* Search Bar (Desktop & Tablet) */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 'Spicy Affair Pizza', 'Bikaji', 'Bournvita', 'Atta'..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-hidden transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded bg-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Active Order Tracker Button (if customer has active order) */}
            {activeOrder && (
              <button
                onClick={onOpenTracker}
                className="relative flex items-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
                title="Track Live Order"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <Bike className="w-4 h-4 text-emerald-600 animate-bounce" />
                <span className="hidden sm:inline">Track Order</span>
                <span className="font-bold text-emerald-900">#{activeOrder.id.slice(-4)}</span>
              </button>
            )}

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-[11px] font-medium text-emerald-100">
                  {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
                </span>
                <span className="font-extrabold text-sm">₹{cartTotal}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pizza, snacks, groceries, milk..."
              className="w-full pl-10 pr-10 py-2 bg-slate-100 text-sm text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded bg-slate-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
