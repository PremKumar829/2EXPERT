import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';
import confetti from 'canvas-confetti';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Bike,
  ShieldCheck,
  PhoneCall,
  MessageSquare,
  ArrowRight,
  AlertCircle,
  FileText,
  MapPin,
  Sparkles,
  Wallet
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartItemCount,
    storeSettings,
    placeOrder
  } = useApp();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);

  if (!isOpen) return null;

  // Delivery Calculations
  const deliveryFee =
    cartTotal >= storeSettings.freeDeliveryThreshold ? 0 : storeSettings.standardDeliveryFee;
  const grandTotal = cartTotal + deliveryFee;
  const amountNeededForFreeDelivery = Math.max(
    0,
    storeSettings.freeDeliveryThreshold - cartTotal
  );

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!customerName.trim()) {
      errors.customerName = 'Please enter your name';
    }
    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      errors.customerPhone = 'Enter a valid 10-digit mobile number';
    }
    if (!deliveryAddress.trim()) {
      errors.deliveryAddress = 'Please enter complete house/flat and street address';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (cart.length === 0) return;

    setIsSubmitting(true);

    try {
      // Fire confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }

      const { order, whatsappUrl } = placeOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        landmark: landmark.trim() || undefined,
        paymentMethod,
        orderNotes: orderNotes.trim() || undefined
      });

      // Automatically trigger opening WhatsApp in new tab with the pre-formatted Tax Invoice
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      setIsSubmitting(false);
      onClose();
      onOrderSuccess();
    } catch (err) {
      console.error('Failed to place order:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-base shadow-sm">
                2X
              </div>
              <div>
                <h2 className="font-extrabold text-base sm:text-lg text-white">Your Delivery Cart</h2>
                <p className="text-xs text-slate-300 font-medium">
                  {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} • Fast 12-15m dispatch
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl font-bold">
                  🛍️
                </div>
                <h3 className="font-extrabold text-lg text-slate-800">Your cart is empty</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
                  Add some delicious Spicy Affair Pizzas, Bikaji snacks, or fresh groceries to get started!
                </p>
                <button
                  onClick={onClose}
                  className="mt-3 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              <>
                {/* Free Delivery Bar */}
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200/80">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-1.5">
                    <span className="flex items-center gap-1">
                      <Bike className="w-4 h-4 text-emerald-600" />
                      {deliveryFee === 0 ? '🎉 Free Delivery Unlocked!' : `Add ₹${amountNeededForFreeDelivery} more for FREE delivery`}
                    </span>
                    <span>Goal: ₹{storeSettings.freeDeliveryThreshold}</span>
                  </div>
                  <div className="w-full h-2 bg-emerald-200/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (cartTotal / storeSettings.freeDeliveryThreshold) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Items in Cart ({cart.length})
                    </h4>
                    <button
                      onClick={clearCart}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                    >
                      Empty Cart
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200/70"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-xs text-slate-900 truncate">
                            {item.product.name}
                          </h5>
                          <div className="text-[11px] text-slate-500">
                            ₹{item.product.price} × {item.quantity} = <strong className="text-slate-800">₹{item.product.price * item.quantity}</strong>
                          </div>
                        </div>

                        {/* Quantity Buttons */}
                        <div className="flex items-center bg-white border border-slate-300 rounded-lg shadow-2xs overflow-hidden shrink-0">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checkout & Delivery Address Form */}
                <form onSubmit={handleCheckout} className="space-y-4 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span>Delivery Details</span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border ${
                          formErrors.customerName ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200'
                        } focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20`}
                      />
                      {formErrors.customerName && (
                        <p className="text-[11px] text-rose-600 mt-0.5">{formErrors.customerName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mobile Number * (For WhatsApp updates & rider call)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="98765 43210"
                          className={`w-full pl-12 pr-3 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border ${
                            formErrors.customerPhone ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200'
                          } focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20`}
                        />
                      </div>
                      {formErrors.customerPhone && (
                        <p className="text-[11px] text-rose-600 mt-0.5">{formErrors.customerPhone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Complete Delivery Address *
                      </label>
                      <textarea
                        rows={2}
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Flat No, Floor, Building / House Name, Street..."
                        className={`w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border ${
                          formErrors.deliveryAddress ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200'
                        } focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20`}
                      />
                      {formErrors.deliveryAddress && (
                        <p className="text-[11px] text-rose-600 mt-0.5">{formErrors.deliveryAddress}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Nearby Landmark (Optional)
                        </label>
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          placeholder="e.g. Near Shiv Mandir"
                          className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Note for Rider
                        </label>
                        <input
                          type="text"
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          placeholder="e.g. Ring bell twice"
                          className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Select Payment Mode
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          paymentMethod === 'upi'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="text-base mb-1">📱</div>
                        <div className="text-[11px] font-extrabold leading-tight">UPI on Delivery</div>
                        <div className="text-[9px] text-slate-500">GPay / PhonePe</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          paymentMethod === 'cod'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="text-base mb-1">💵</div>
                        <div className="text-[11px] font-extrabold leading-tight">Cash on Delivery</div>
                        <div className="text-[9px] text-slate-500">Pay cash</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('khata')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          paymentMethod === 'khata'
                            ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="text-base mb-1">📒</div>
                        <div className="text-[11px] font-extrabold leading-tight">Digital Khata</div>
                        <div className="text-[9px] text-slate-500">Pay Later / Udhari</div>
                      </button>
                    </div>
                  </div>

                  {/* Bill Breakdown */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Items Subtotal</span>
                      <span className="font-semibold text-slate-800">₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Delivery Fee</span>
                      <span className="font-semibold">
                        {deliveryFee === 0 ? (
                          <span className="text-emerald-600 font-bold">FREE</span>
                        ) : (
                          `₹${deliveryFee}`
                        )}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
                      <span className="font-extrabold text-slate-900">Grand Total</span>
                      <span className="font-black text-emerald-700 text-base">₹{grandTotal}</span>
                    </div>
                  </div>

                  {/* WhatsApp Automated Invoice Note */}
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 text-xs">
                    <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Instant WhatsApp Dispatch:</span> Placed order & itemized bill summary will immediately open for dispatch to 2EXPERT owner at <strong className="text-emerald-950">+91 83407 01002</strong>.
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Place Order & Open WhatsApp Invoice</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-slate-100 text-center border-t border-slate-200 text-[11px] text-slate-500">
            2EXPERT Quick-Commerce • 12-15 Min Delivery Guarantee
          </div>

        </div>
      </div>
    </div>
  );
};
