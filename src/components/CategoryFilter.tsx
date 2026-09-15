import React from 'react';
import { Sparkles, Pizza, Cookie, Coffee, ShoppingBasket, HeartPulse, SlidersHorizontal } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  vegOnly: boolean;
  onToggleVegOnly: () => void;
  productCount: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  vegOnly,
  onToggleVegOnly,
  productCount
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'All':
        return <Sparkles className="w-4 h-4" />;
      case 'Fast Food & Pizza':
        return <Pizza className="w-4 h-4" />;
      case 'Snacks & Namkeen':
        return <Cookie className="w-4 h-4" />;
      case 'Beverages & Dairy':
        return <Coffee className="w-4 h-4" />;
      case 'Groceries & Staples':
        return <ShoppingBasket className="w-4 h-4" />;
      case 'Daily Needs':
        return <HeartPulse className="w-4 h-4" />;
      default:
        return <SlidersHorizontal className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        
        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/90'
                }`}
              >
                <span className={isSelected ? 'text-amber-400' : 'text-slate-500'}>
                  {getCategoryIcon(cat)}
                </span>
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Veg Only Filter & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
          <button
            onClick={onToggleVegOnly}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
              vegOnly
                ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-sm border border-emerald-600 flex items-center justify-center p-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            </span>
            <span>Pure Veg Only</span>
          </button>

          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{productCount}</strong> items
          </span>
        </div>

      </div>
    </div>
  );
};
