import React, { useState, useMemo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { ClosedStoreBanner } from './components/ClosedStoreBanner';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { OrderStatusModal } from './components/OrderStatusModal';
import { AdminModal } from './components/Admin/AdminModal';
import {
  ShoppingBag,
  Bike,
  ShieldCheck,
  PhoneCall,
  Clock,
  Sparkles,
  MapPin,
  ChevronRight,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

function StorefrontApp() {
  const { products, cart, cartTotal, cartItemCount, activeOrder, storeSettings } = useApp();

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const list = ['All'];
    products.forEach((p) => {
      if (!list.includes(p.category)) {
        list.push(p.category);
      }
    });
    return list;
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query);

      // Category match
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

      // Veg match
      const matchesVeg = !vegOnly || p.isVeg;

      return matchesSearch && matchesCategory && matchesVeg;
    });
  }, [products, searchQuery, selectedCategory, vegOnly]);

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* Header */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTracker={() => setIsStatusModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Global Shop Closed Banner (Triggered when Admin toggles shop offline) */}
      <ClosedStoreBanner />

      {/* Main Content */}
      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <HeroBanner onExploreClick={scrollToCatalog} />

        {/* Category Filter Pills & Veg Toggle */}
        <div id="catalog-section" className="scroll-mt-24">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            vegOnly={vegOnly}
            onToggleVegOnly={() => setVegOnly(!vegOnly)}
            productCount={filteredProducts.length}
          />
        </div>

        {/* Product Catalog Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
              <div className="text-4xl">🔍</div>
              <h3 className="text-lg font-bold text-slate-800">No items found</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                We couldn't find any products matching "{searchQuery}". Try searching for 'Pizza', 'Bournvita', 'Bikaji', or 'Milk'.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setVegOnly(false);
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Why 2EXPERT Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Local Quick-Commerce Promise
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Why Shop With 2EXPERT?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Direct local delivery with authentic shop prices and no inflated markups.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xl shrink-0">
                  ⚡
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">12-15 Mins Delivery</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Prepared and dispatched instantly from our neighborhood hub with live tracking.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xl shrink-0">
                  🧾
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">WhatsApp Tax Invoice</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Every order generates a formatted tax bill summary sent straight to your WhatsApp.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xl shrink-0">
                  📒
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Digital Khata (Udhari)</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Trusted local regular customers can purchase items on monthly digital ledger.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xl shrink-0">
                  🍕
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Fresh & Hygienic</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Freshly baked pizzas, chilled dairy products, and authentic branded packaged staples.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Bottom Cart Bar for Mobile & Compact Screens */}
      {cartItemCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 z-40 animate-in slide-in-from-bottom duration-300">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full sm:w-auto flex items-center justify-between gap-4 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3.5 rounded-2xl shadow-xl shadow-emerald-600/30 border border-emerald-500 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs text-emerald-100 font-semibold leading-none">
                  {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in cart
                </div>
                <div className="text-base font-black leading-tight mt-0.5">₹{cartTotal}</div>
              </div>
            </div>

            <div className="flex items-center gap-1 font-bold text-sm pl-4 border-l border-emerald-500/60">
              <span>View Cart</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
                  2X
                </div>
                <span className="font-extrabold text-lg text-white">2EXPERT</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Expert Services Near You. Jo saman chahiye, bas message kariye. Serving hot fast food, groceries, snacks and daily essentials in 12-15 mins.
              </p>
              <div className="text-[11px] text-amber-400 font-semibold">
                Established 2026 • Local Quick-Commerce
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-3">Popular Categories</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory('Fast Food & Pizza');
                      scrollToCatalog();
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Spicy Affair Pizzas & Burgers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory('Snacks & Namkeen');
                      scrollToCatalog();
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Bikaji Bhujia & Namkeens
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory('Beverages & Dairy');
                      scrollToCatalog();
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Bournvita, Horlicks & Amul Milk
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory('Groceries & Staples');
                      scrollToCatalog();
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Atta, Rice, Oil & Kitchen Staples
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-3">Contact & Store Info</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a
                    href={`https://wa.me/${storeSettings.ownerPhone.replace(/[^0-9]/g, '')}`}
                    className="hover:text-white"
                  >
                    WhatsApp: {storeSettings.ownerPhone}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{storeSettings.storeAddress}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Delivery Hours: 7:00 AM - 11:30 PM</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-3">Store Controls</h4>
              <p className="text-slate-400 text-xs mb-3">
                Authorized store staff & managers can login to view incoming orders and manage the khata ledger.
              </p>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold border border-slate-700 transition-colors text-center cursor-pointer"
              >
                Open Admin Portal (PIN: 2026)
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © 2026 2EXPERT Quick-Commerce. All rights reserved. "Jo saman chahiye, bas message kariye."
            </div>
            <div className="flex items-center gap-4">
              <span>Full-Stack Ready: React 19 + TypeScript + Tailwind</span>
              <span>•</span>
              <span>PostgreSQL & Redis Architecture</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderSuccess={() => setIsStatusModalOpen(true)}
      />

      {/* Live Order Status & ETA Tracker Modal */}
      <OrderStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      />

      {/* Secure Admin Portal Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <StorefrontApp />
    </AppProvider>
  );
}
