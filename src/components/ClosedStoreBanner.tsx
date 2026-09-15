import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, PhoneCall, AlertTriangle } from 'lucide-react';

export const ClosedStoreBanner: React.FC = () => {
  const { storeSettings } = useApp();

  if (storeSettings.isOpen) return null;

  return (
    <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-950 text-white border-b border-rose-700/60 py-3.5 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-400/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-300" />
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2">
              <span>STORE CURRENTLY CLOSED — BACK SOON!</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/30 text-rose-200">
                Offline
              </span>
            </div>
            <p className="text-xs sm:text-sm text-rose-200/90 mt-0.5">
              {storeSettings.closedMessage}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`https://wa.me/${storeSettings.ownerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello 2EXPERT, checking when the store will open for delivery.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-rose-950 font-bold text-xs hover:bg-rose-50 transition-colors shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>Inquire on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
