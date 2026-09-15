import React from 'react';
import { useApp } from '../context/AppContext';
import { Zap, Clock, ShieldCheck, MessageSquare, ArrowRight, Sparkles, MapPin } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick }) => {
  const { storeSettings } = useApp();

  return (
    <div className="relative overflow-hidden bg-slate-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-auto max-w-7xl mt-4 sm:mt-6 border border-slate-800 shadow-2xl">
      {/* Decorative gradient backdrops */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Background subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="relative z-10 px-6 sm:px-10 py-8 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-5">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                2EXPERT • Since 2026
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                12-15 Min Express Delivery
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                Local Neighborhood Store
              </span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Jo saman chahiye, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-emerald-400">
                  bas message kariye.
                </span>
              </h1>
              <p className="mt-2 text-base sm:text-lg text-slate-300 font-medium max-w-2xl leading-relaxed">
                Expert Services Near You. From piping hot <span className="text-amber-300 font-semibold">Spicy Affair Pizzas</span> & tea snacks (Bikaji, Bournvita) to emergency daily groceries delivered to your doorstep in minutes.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Browse Menu & Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${storeSettings.ownerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello 2EXPERT! I would like to order items for delivery.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 font-bold text-sm sm:text-base border border-slate-700 transition-colors shadow-sm"
              >
                <MessageSquare className="w-4.5 h-4.5" />
                <span>WhatsApp Order Hotline</span>
              </a>
            </div>

            {/* Key Value Props Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">12-15 Mins</div>
                  <div className="text-slate-400 text-[11px]">Lightning fast</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">Free &gt; ₹199</div>
                  <div className="text-slate-400 text-[11px]">No hidden cost</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">WhatsApp Bill</div>
                  <div className="text-slate-400 text-[11px]">Instant tax invoice</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <span className="text-sm font-black">📒</span>
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">Digital Khata</div>
                  <div className="text-slate-400 text-[11px]">Pay later for regulars</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Highlight Visual Card */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  🔥 Trending Near You
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  In Stock
                </span>
              </div>

              <div className="flex gap-3 items-center bg-slate-800/70 p-3 rounded-xl border border-slate-700/50">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=160&auto=format&fit=crop&q=80"
                  alt="Spicy Affair Pizza"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">Spicy Affair Pizza (8")</h4>
                  <p className="text-xs text-slate-400">Fresh Hand-Tossed Mozzarella</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-extrabold text-amber-400">₹189</span>
                    <span className="text-xs text-slate-500 line-through">₹249</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded">
                      24% OFF
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 items-center bg-slate-800/70 p-3 rounded-xl border border-slate-700/50">
                <img
                  src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=160&auto=format&fit=crop&q=80"
                  alt="Bikaji Bhujia"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">Bikaji Bhujia Sev (400g)</h4>
                  <p className="text-xs text-slate-400">Authentic Bikaneri Crispy</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-extrabold text-amber-400">₹120</span>
                    <span className="text-xs text-slate-500 line-through">₹140</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded">
                      14% OFF
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-1">
                <span className="text-[11px] text-slate-400">
                  Fastest delivery across town • Direct WhatsApp dispatch
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
