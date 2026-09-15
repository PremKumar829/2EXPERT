import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Plus, Minus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, updateCartQuantity, storeSettings } = useApp();

  const cartItem = cart.find(item => item.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden">
      
      {/* Top Image Section */}
      <div className="relative w-full pt-[72%] bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.badge && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-xs">
              {product.badge}
            </span>
          )}
          {product.discountPercentage > 0 && (
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold text-[10px] shadow-xs">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Veg/Non-Veg Badge */}
        <div className="absolute top-2.5 right-2.5">
          <div className="w-5 h-5 bg-white/95 backdrop-blur-xs rounded-sm border border-emerald-600 flex items-center justify-center p-0.5 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          </div>
        </div>

        {/* Stock Out Overlay */}
        {(!product.inStock || product.stockCount <= 0) && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unit / Weight Tag */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span className="bg-slate-100 px-2 py-0.5 rounded-md">{product.unit}</span>
            <span className="text-[11px] text-slate-400">⚡ 12-15 mins</span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Price details */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900">
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-bold">
              {product.discountPercentage > 0 ? `Save ₹${product.originalPrice - product.price}` : 'Inclusive of all taxes'}
            </span>
          </div>

          {/* Quantity Controls / Add Button */}
          <div className="shrink-0">
            {(!product.inStock || product.stockCount <= 0) ? (
              <button
                disabled
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed"
              >
                Unavailable
              </button>
            ) : quantityInCart === 0 ? (
              <button
                onClick={() => addToCart(product)}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-300 hover:border-emerald-600 font-extrabold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
              </button>
            ) : (
              <div className="flex items-center bg-emerald-700 text-white rounded-xl overflow-hidden shadow-sm border border-emerald-800">
                <button
                  onClick={() => updateCartQuantity(product.id, -1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-emerald-800 active:bg-emerald-900 transition-colors cursor-pointer"
                  title="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center font-black text-xs sm:text-sm">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => updateCartQuantity(product.id, 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-emerald-800 active:bg-emerald-900 transition-colors cursor-pointer"
                  title="Increase"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
