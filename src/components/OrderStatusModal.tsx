import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';
import { generateWhatsAppOrderInvoice } from '../utils/whatsapp';
import {
  X,
  Clock,
  Bike,
  CheckCircle2,
  PackageCheck,
  PhoneCall,
  MessageSquare,
  Copy,
  Check,
  Receipt,
  MapPin,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({ isOpen, onClose }) => {
  const { activeOrder, storeSettings } = useApp();
  const [secondsRemaining, setSecondsRemaining] = useState<number>(14 * 60 + 35); // ~14m 35s
  const [copied, setCopied] = useState(false);
  const [showBillDetails, setShowBillDetails] = useState(false);

  // Live countdown timer
  useEffect(() => {
    if (!isOpen || !activeOrder) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, activeOrder]);

  if (!isOpen || !activeOrder) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedCountdown = `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;

  // Status mapping
  const steps: { key: OrderStatus; label: string; icon: string; desc: string }[] = [
    {
      key: 'placed',
      label: 'Order Placed',
      icon: '🟢',
      desc: 'Order confirmed & sent to kitchen/store'
    },
    {
      key: 'packing',
      label: 'Packing in Progress',
      icon: '🟡',
      desc: 'Fresh items being verified & packed securely'
    },
    {
      key: 'out_for_delivery',
      label: 'Out for Delivery',
      icon: '🛵',
      desc: 'Rider is on the way to your address'
    },
    {
      key: 'delivered',
      label: 'Delivered',
      icon: '✅',
      desc: 'Safely handed over at your doorstep'
    }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'packing':
        return 1;
      case 'out_for_delivery':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(activeOrder.status);
  const { text: invoiceText, url: whatsappUrl } = generateWhatsAppOrderInvoice(
    activeOrder,
    storeSettings.ownerPhone
  );

  const handleCopyInvoice = () => {
    navigator.clipboard.writeText(invoiceText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-5 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                LIVE TRACKER
              </span>
              <h2 className="text-xl font-extrabold text-white mt-1">
                Order #{activeOrder.id}
              </h2>
              <p className="text-xs text-slate-300">
                Placed on {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ETA Countdown Highlight Card */}
          <div className="mt-4 bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                <Clock className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <div className="text-[11px] text-emerald-200 font-bold uppercase tracking-wider">
                  Estimated Delivery in
                </div>
                <div className="text-2xl font-black text-white tracking-tight">
                  {activeOrder.status === 'delivered' ? 'DELIVERED 🎉' : formattedCountdown}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-slate-300 block">Est. Time</span>
              <span className="text-sm font-extrabold text-amber-300">
                {activeOrder.estimatedDeliveryTime}
              </span>
            </div>
          </div>
        </div>

        {/* Tracking Body */}
        <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Visual Progress Steps Bar */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Order Status
            </h3>

            <div className="space-y-4">
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.key} className="flex items-start gap-3 relative">
                    {/* Connecting Vertical Line */}
                    {idx < steps.length - 1 && (
                      <div
                        className={`absolute left-4 top-8 -bottom-4 w-0.5 transition-colors ${
                          idx < currentStepIdx ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      />
                    )}

                    {/* Step Icon Indicator */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-xs font-bold text-slate-400">{idx + 1}</span>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-900">
                          {step.label}
                        </span>
                        <span className="text-sm">{step.icon}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                            Active Step
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Rider & Destination Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
                  🛵
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Sonu Kumar (Delivery Partner)</h4>
                  <p className="text-xs text-slate-500">Hero Splendor • Assigned Rider</p>
                </div>
              </div>

              <a
                href={`tel:${storeSettings.ownerPhone}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-bold text-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Store</span>
              </a>
            </div>

            <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <strong>Delivering to:</strong> {activeOrder.customerName} ({activeOrder.customerPhone})
                <div className="text-slate-500">{activeOrder.deliveryAddress}</div>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Action & Invoice Options */}
          <div className="space-y-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open Order on Store WhatsApp (+91 83407 01002)</span>
            </a>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyInvoice}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Invoice Copied to Clipboard!' : 'Copy Formatted Bill Text'}</span>
              </button>

              <button
                onClick={() => setShowBillDetails(!showBillDetails)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5 text-slate-600" />
                <span>{showBillDetails ? 'Hide Bill' : 'View Bill'}</span>
              </button>
            </div>
          </div>

          {/* Formatted Bill Accordion / Viewer */}
          {showBillDetails && (
            <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 font-mono text-xs space-y-2 border border-slate-800">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-slate-400">
                <span className="font-sans font-bold text-white text-xs">Tax Invoice Payload</span>
                <span>ID: {activeOrder.id}</span>
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed text-[11px] text-emerald-300 overflow-x-auto">
                {invoiceText}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          Have an issue with your order? WhatsApp 2EXPERT directly at <strong>+91 83407 01002</strong>
        </div>

      </div>
    </div>
  );
};
