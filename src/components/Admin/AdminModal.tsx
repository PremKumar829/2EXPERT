import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus, Product, TransactionType } from '../../types';
import { playOrderNotificationSound } from '../../utils/audio';
import { generateWhatsAppOrderInvoice, generateKhataReminderMessage } from '../../utils/whatsapp';
import {
  X,
  Lock,
  Unlock,
  Store,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertTriangle,
  Volume2,
  VolumeX,
  Bell,
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  DollarSign,
  PhoneCall,
  MessageSquare,
  Search,
  Database,
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  Power
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const {
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    storeSettings,
    toggleStoreOpen,
    updateStoreSettings,
    orders,
    updateOrderStatus,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    khataCustomers,
    addKhataCustomer,
    addKhataTransaction,
    audioAlertsEnabled,
    setAudioAlertsEnabled,
    unreadOrdersCount,
    markOrdersAsRead
  } = useApp();

  // Authentication State
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  type AdminTab = 'orders' | 'inventory' | 'khata' | 'settings' | 'architecture';
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');

  // Search & Filter in Admin
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [inventorySearch, setInventorySearch] = useState('');
  const [khataSearch, setKhataSearch] = useState('');

  // New Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Fast Food & Pizza');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdOrigPrice, setNewProdOrigPrice] = useState('');
  const [newProdUnit, setNewProdUnit] = useState('1 pc');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdStock, setNewProdStock] = useState('20');
  const [newProdIsVeg, setNewProdIsVeg] = useState(true);

  // New Khata Customer & Transaction Modal State
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustInitialDue, setNewCustInitialDue] = useState('');
  const [newCustNotes, setNewCustNotes] = useState('');

  // Add Transaction Modal
  const [selectedKhataCustId, setSelectedKhataCustId] = useState<string | null>(null);
  const [txType, setTxType] = useState<TransactionType>('credit');
  const [txAmount, setTxAmount] = useState('');
  const [txDesc, setTxDesc] = useState('');

  if (!isOpen) return null;

  // PIN Login Handler
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(pinInput);
    if (success) {
      setAuthError('');
      setPinInput('');
      markOrdersAsRead();
    } else {
      setAuthError('Invalid Admin PIN. (Default PIN is 2026)');
    }
  };

  // Quick bypass helper for ease of demonstration
  const handleQuickUnlock = () => {
    loginAdmin('2026');
    setAuthError('');
    markOrdersAsRead();
  };

  // Add product handler
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    const price = parseFloat(newProdPrice);
    const origPrice = newProdOrigPrice ? parseFloat(newProdOrigPrice) : price;
    const discount = origPrice > price ? Math.round(((origPrice - price) / origPrice) * 100) : 0;

    addProduct({
      name: newProdName,
      category: newProdCategory,
      price,
      originalPrice: origPrice,
      unit: newProdUnit,
      image: newProdImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
      inStock: true,
      stockCount: parseInt(newProdStock) || 20,
      description: newProdDesc || 'Freshly stocked high-quality item.',
      isVeg: newProdIsVeg,
      discountPercentage: discount,
      badge: discount > 15 ? 'Hot Deal' : undefined
    });

    // Reset
    setShowAddProductModal(false);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdOrigPrice('');
    setNewProdDesc('');
    setNewProdImage('');
  };

  // Add Khata Customer Handler
  const handleCreateKhataCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) return;

    addKhataCustomer({
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      address: newCustAddress.trim(),
      totalDue: parseFloat(newCustInitialDue) || 0,
      notes: newCustNotes.trim() || undefined
    });

    setShowAddCustomerModal(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setNewCustInitialDue('');
    setNewCustNotes('');
  };

  // Add Khata Transaction Handler
  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKhataCustId || !txAmount) return;

    addKhataTransaction(selectedKhataCustId, {
      type: txType,
      amount: parseFloat(txAmount),
      description: txDesc || (txType === 'credit' ? 'Udhari / Goods taken' : 'Payment received (Jama)')
    });

    setSelectedKhataCustId(null);
    setTxAmount('');
    setTxDesc('');
  };

  // Khata Totals
  const totalMarketUdhari = khataCustomers.reduce((sum, c) => sum + c.totalDue, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Top Navbar */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
              2X
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg text-white">2EXPERT Control Hub</h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Owner Hotline: <strong>{storeSettings.ownerPhone}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio Alert Toggle & Test */}
            <button
              onClick={() => {
                setAudioAlertsEnabled(!audioAlertsEnabled);
                if (!audioAlertsEnabled) playOrderNotificationSound();
              }}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                audioAlertsEnabled
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
              title="Toggle Order Chime Notification"
            >
              {audioAlertsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">Chime</span>
            </button>

            {isAdminAuthenticated && (
              <button
                onClick={logoutAdmin}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Logout
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Authenticated: Secure PIN Screen */}
        {!isAdminAuthenticated ? (
          <div className="p-8 sm:p-12 flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Admin Route Protection</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter your 4-digit Master Store PIN to access live order dispatch, inventory pricing, and digital ledger.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={10}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter PIN (e.g. 2026)"
                  className="w-full text-center tracking-[0.4em] text-2xl font-black px-4 py-3 bg-slate-100 rounded-2xl border border-slate-300 focus:bg-white focus:border-amber-500 focus:outline-hidden"
                  autoFocus
                />
                {authError && <p className="text-xs text-rose-600 mt-1.5 font-bold">{authError}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm transition-all shadow-md cursor-pointer"
              >
                Unlock Dashboard
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 w-full">
              <button
                type="button"
                onClick={handleQuickUnlock}
                className="text-xs text-amber-600 hover:text-amber-700 font-bold underline cursor-pointer"
              >
                Quick Demo Unlock (Default PIN: 2026)
              </button>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Global Shop Open / Closed Controller Strip */}
            <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Global Storefront Switch:
                </span>
                <button
                  onClick={toggleStoreOpen}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors cursor-pointer ${
                    storeSettings.isOpen ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  title="Click to toggle shop open or closed"
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      storeSettings.isOpen ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span
                  className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                    storeSettings.isOpen
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {storeSettings.isOpen ? 'STORE OPEN (Accepting Orders)' : 'STORE CLOSED (Offline Banner Visible)'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => playOrderNotificationSound()}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs cursor-pointer flex items-center gap-1"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-500" />
                  <span>Test Audio Bell</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-200 bg-white overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'orders'
                    ? 'border-amber-500 text-amber-700 bg-amber-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Live Orders</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px] font-black">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'inventory'
                    ? 'border-amber-500 text-amber-700 bg-amber-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Products & Stock</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px] font-black">
                  {products.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('khata')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'khata'
                    ? 'border-amber-500 text-amber-700 bg-amber-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Digital Khata (Ledger)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ₹{totalMarketUdhari} Due
                </span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'settings'
                    ? 'border-amber-500 text-amber-700 bg-amber-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Store Settings</span>
              </button>

              <button
                onClick={() => setActiveTab('architecture')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'architecture'
                    ? 'border-amber-500 text-amber-700 bg-amber-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Database className="w-4 h-4 text-purple-600" />
                <span>Prisma & Redis Stack</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-5 bg-slate-50">
              
              {/* TAB 1: LIVE ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">Filter Status:</span>
                      {['all', 'placed', 'packing', 'out_for_delivery', 'delivered'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setOrderFilter(st)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                            orderFilter === st
                              ? 'bg-slate-900 text-white'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>

                    <div className="text-xs text-slate-500 font-semibold">
                      Total Orders: <strong className="text-slate-800">{orders.length}</strong>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {orders
                      .filter((o) => (orderFilter === 'all' ? true : o.status === orderFilter))
                      .map((order) => {
                        const { url: waUrl } = generateWhatsAppOrderInvoice(order, storeSettings.ownerPhone);

                        return (
                          <div
                            key={order.id}
                            className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3"
                          >
                            {/* Order Top Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                                  #{order.id}
                                </span>
                                <span className="text-xs text-slate-500 font-medium">
                                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                  {order.paymentMethod === 'cod'
                                    ? '💵 Cash'
                                    : order.paymentMethod === 'upi'
                                    ? '📱 UPI'
                                    : '📒 Khata'}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-emerald-700">
                                  ₹{order.total}
                                </span>
                                <a
                                  href={waUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>WhatsApp Bill</span>
                                </a>
                              </div>
                            </div>

                            {/* Customer & Address Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              <div>
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{order.customerName}</span>
                                  <a
                                    href={`tel:${order.customerPhone}`}
                                    className="text-emerald-600 hover:underline inline-flex items-center gap-0.5"
                                  >
                                    <PhoneCall className="w-3 h-3" />
                                    {order.customerPhone}
                                  </a>
                                </div>
                                <div className="text-slate-600 mt-0.5">{order.deliveryAddress}</div>
                                {order.landmark && (
                                  <div className="text-slate-500 italic">Landmark: {order.landmark}</div>
                                )}
                              </div>

                              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                                <div className="font-bold text-slate-700 mb-1">
                                  Items ({order.items.length}):
                                </div>
                                <div className="space-y-0.5 text-slate-600">
                                  {order.items.map((it, idx) => (
                                    <div key={idx} className="flex justify-between">
                                      <span>
                                        {it.quantity}x {it.product.name}
                                      </span>
                                      <span className="font-semibold text-slate-800">
                                        ₹{it.quantity * it.product.price}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Status Changer Actions */}
                            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
                                <span>Change Status:</span>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5">
                                {(
                                  [
                                    { key: 'placed', label: '1. Placed 🟢' },
                                    { key: 'packing', label: '2. Packing 🟡' },
                                    { key: 'out_for_delivery', label: '3. Out 🛵' },
                                    { key: 'delivered', label: '4. Done ✅' }
                                  ] as { key: OrderStatus; label: string }[]
                                ).map((st) => (
                                  <button
                                    key={st.key}
                                    onClick={() => updateOrderStatus(order.id, st.key)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                      order.status === st.key
                                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    }`}
                                  >
                                    {st.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* TAB 2: INVENTORY & PRODUCTS */}
              {activeTab === 'inventory' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="relative max-w-xs w-full">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={inventorySearch}
                        onChange={(e) => setInventorySearch(e.target.value)}
                        placeholder="Filter catalog items..."
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-hidden"
                      />
                    </div>

                    <button
                      onClick={() => setShowAddProductModal(true)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Product</span>
                    </button>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {products
                      .filter((p) =>
                        p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                        p.category.toLowerCase().includes(inventorySearch.toLowerCase())
                      )
                      .map((product) => (
                        <div
                          key={product.id}
                          className="bg-white rounded-2xl p-3.5 border border-slate-200 flex flex-col justify-between space-y-3"
                        >
                          <div className="flex gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 rounded-xl object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">
                                {product.category}
                              </span>
                              <h4 className="font-bold text-xs text-slate-900 line-clamp-2">
                                {product.name}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="font-black text-sm text-slate-900">₹{product.price}</span>
                                {product.originalPrice > product.price && (
                                  <span className="text-[11px] text-slate-400 line-through">
                                    ₹{product.originalPrice}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                            <button
                              onClick={() => updateProduct(product.id, { inStock: !product.inStock })}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                                product.inStock
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {product.inStock ? '● In Stock' : '✕ Out of Stock'}
                            </button>

                            <div className="flex items-center gap-2">
                              {/* Stock count quick adjuster */}
                              <div className="flex items-center bg-slate-100 rounded-lg px-2 py-0.5 font-mono text-xs font-bold text-slate-700">
                                <span>Qty: {product.stockCount}</span>
                              </div>

                              <button
                                onClick={() => deleteProduct(product.id)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* TAB 3: DIGITAL KHATA (LOCAL LEDGER) */}
              {activeTab === 'khata' && (
                <div className="space-y-5">
                  {/* Ledger Banner / Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-gradient-to-br from-rose-50 to-rose-100/80 p-4 rounded-2xl border border-rose-200">
                      <div className="text-xs font-bold uppercase tracking-wider text-rose-700">
                        Total Pending Khata Udhari
                      </div>
                      <div className="text-2xl font-black text-rose-950 mt-1">
                        ₹{totalMarketUdhari}
                      </div>
                      <div className="text-[11px] text-rose-700/80 mt-0.5">
                        Amount to be collected from regular buyers
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/80 p-4 rounded-2xl border border-emerald-200">
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                        Total Khata Customers
                      </div>
                      <div className="text-2xl font-black text-emerald-950 mt-1">
                        {khataCustomers.length} Regulars
                      </div>
                      <div className="text-[11px] text-emerald-700/80 mt-0.5">
                        Trusted local neighborhood patrons
                      </div>
                    </div>

                    <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                          Khata Automation
                        </div>
                        <div className="text-xs text-slate-300 mt-1">
                          1-Click WhatsApp payment reminder text with UPI QR link.
                        </div>
                      </div>
                      <button
                        onClick={() => setShowAddCustomerModal(true)}
                        className="mt-2 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Customer to Ledger</span>
                      </button>
                    </div>
                  </div>

                  {/* Customer Ledger List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="relative max-w-xs w-full">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={khataSearch}
                          onChange={(e) => setKhataSearch(e.target.value)}
                          placeholder="Search customer name or phone..."
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {khataCustomers
                        .filter((c) =>
                          c.name.toLowerCase().includes(khataSearch.toLowerCase()) ||
                          c.phone.includes(khataSearch)
                        )
                        .map((customer) => {
                          const { url: reminderUrl } = generateKhataReminderMessage(customer);

                          return (
                            <div
                              key={customer.id}
                              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                                      {customer.name}
                                    </h4>
                                    <span className="text-xs font-semibold text-slate-500">
                                      {customer.phone}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-0.5">{customer.address}</p>
                                  {customer.notes && (
                                    <p className="text-[11px] text-slate-400 italic">{customer.notes}</p>
                                  )}
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                                      Current Due
                                    </span>
                                    <span
                                      className={`text-lg sm:text-xl font-black ${
                                        customer.totalDue > 0 ? 'text-rose-600' : 'text-emerald-600'
                                      }`}
                                    >
                                      ₹{customer.totalDue}
                                    </span>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => {
                                        setSelectedKhataCustId(customer.id);
                                        setTxType('credit');
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                      title="Add Udhari (Credit)"
                                    >
                                      <ArrowUpRight className="w-3.5 h-3.5" />
                                      <span>+ Udhari</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        setSelectedKhataCustId(customer.id);
                                        setTxType('payment');
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                      title="Record Jama / Payment"
                                    >
                                      <ArrowDownLeft className="w-3.5 h-3.5" />
                                      <span>+ Jama</span>
                                    </button>

                                    {customer.totalDue > 0 && (
                                      <a
                                        href={reminderUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                                      >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        <span>WhatsApp Reminder</span>
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Transaction History Snippet */}
                              {customer.transactions.length > 0 && (
                                <div className="pt-2 border-t border-slate-100">
                                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Recent Ledger Entries ({customer.transactions.length})
                                  </div>
                                  <div className="space-y-1 text-xs">
                                    {customer.transactions.slice(0, 3).map((tx) => (
                                      <div
                                        key={tx.id}
                                        className="flex items-center justify-between text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg"
                                      >
                                        <div className="flex items-center gap-2">
                                          <span
                                            className={`font-black text-[10px] px-1.5 py-0.2 rounded uppercase ${
                                              tx.type === 'credit'
                                                ? 'bg-rose-100 text-rose-700'
                                                : 'bg-emerald-100 text-emerald-700'
                                            }`}
                                          >
                                            {tx.type === 'credit' ? 'Udhari' : 'Jama'}
                                          </span>
                                          <span className="truncate max-w-xs">{tx.description}</span>
                                        </div>
                                        <div className="flex items-center gap-2 font-mono">
                                          <span
                                            className={`font-bold ${
                                              tx.type === 'credit' ? 'text-rose-600' : 'text-emerald-600'
                                            }`}
                                          >
                                            {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                                          </span>
                                          <span className="text-[10px] text-slate-400">
                                            {new Date(tx.date).toLocaleDateString()}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: STORE SETTINGS */}
              {activeTab === 'settings' && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-5 max-w-2xl">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                    Store Configuration
                  </h3>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Owner WhatsApp Number (Receives Instant Orders)
                      </label>
                      <input
                        type="text"
                        value={storeSettings.ownerPhone}
                        onChange={(e) => updateStoreSettings({ ownerPhone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Store Address
                      </label>
                      <input
                        type="text"
                        value={storeSettings.storeAddress}
                        onChange={(e) => updateStoreSettings({ storeAddress: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Free Delivery Above (₹)
                        </label>
                        <input
                          type="number"
                          value={storeSettings.freeDeliveryThreshold}
                          onChange={(e) =>
                            updateStoreSettings({ freeDeliveryThreshold: parseFloat(e.target.value) || 0 })
                          }
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Standard Delivery Fee (₹)
                        </label>
                        <input
                          type="number"
                          value={storeSettings.standardDeliveryFee}
                          onChange={(e) =>
                            updateStoreSettings({ standardDeliveryFee: parseFloat(e.target.value) || 0 })
                          }
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Estimated Delivery ETA (Minutes)
                      </label>
                      <input
                        type="number"
                        value={storeSettings.estimatedTimeMins}
                        onChange={(e) =>
                          updateStoreSettings({ estimatedTimeMins: parseInt(e.target.value) || 15 })
                        }
                        className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Storefront Closed Notice Message
                      </label>
                      <textarea
                        rows={2}
                        value={storeSettings.closedMessage}
                        onChange={(e) => updateStoreSettings({ closedMessage: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: PRISMA & REDIS ARCHITECTURE VIEWER */}
              {activeTab === 'architecture' && (
                <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="font-bold text-white text-sm">
                        Production Architecture & Prisma ORM Schema
                      </h3>
                      <p className="text-xs text-slate-400">
                        PostgreSQL Schema + Redis Caching (Configured in /prisma/schema.prisma)
                      </p>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-purple-900/60 text-purple-300 border border-purple-700">
                      PostgreSQL + Redis
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-sans font-bold text-amber-400 text-xs">
                        📦 PostgreSQL Models
                      </div>
                      <ul className="space-y-1 text-slate-300 text-[11px]">
                        <li>• <strong className="text-white">StoreSetting:</strong> isOpen, ownerPhone, banners</li>
                        <li>• <strong className="text-white">Product:</strong> id, name, price, stock, isVeg</li>
                        <li>• <strong className="text-white">Order:</strong> status (PLACED, PACKING, OUT, DELIVERED)</li>
                        <li>• <strong className="text-white">OrderItem:</strong> relation between Order and Product</li>
                        <li>• <strong className="text-white">KhataCustomer:</strong> name, phone, totalDue</li>
                        <li>• <strong className="text-white">KhataTransaction:</strong> CREDIT / PAYMENT ledger</li>
                      </ul>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-sans font-bold text-emerald-400 text-xs">
                        ⚡ Redis Caching Architecture
                      </div>
                      <ul className="space-y-1 text-slate-300 text-[11px]">
                        <li>• <strong className="text-white">store:status:</strong> TTL 30s (Instant open/closed check)</li>
                        <li>• <strong className="text-white">catalog:products:all:</strong> TTL 5m (Zero DB load for visitors)</li>
                        <li>• <strong className="text-white">order:status:&lt;id&gt;:</strong> TTL 15s (Live polling tracker)</li>
                        <li>• <strong className="text-white">rate_limit:&lt;ip&gt;:</strong> Rolling window spam filter</li>
                      </ul>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl">
                    💡 <strong>Ready for instant deployment:</strong> All schemas are structured for direct Next.js / Express deployment. When deployed with a live database, simply set <code className="text-amber-300">DATABASE_URL</code> and run <code className="text-emerald-300">npx prisma db push</code>.
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* MODAL: Add New Product */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-extrabold text-base text-slate-900">Add New Product</h3>
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Cheesy Paneer Pizza 8 inch"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <option value="Fast Food & Pizza">Fast Food & Pizza</option>
                      <option value="Snacks & Namkeen">Snacks & Namkeen</option>
                      <option value="Beverages & Dairy">Beverages & Dairy</option>
                      <option value="Groceries & Staples">Groceries & Staples</option>
                      <option value="Daily Needs">Daily Needs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Unit / Weight</label>
                    <input
                      type="text"
                      value={newProdUnit}
                      onChange={(e) => setNewProdUnit(e.target.value)}
                      placeholder="e.g. 500g, 1 Box"
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Selling Price (₹)*</label>
                    <input
                      type="number"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      placeholder="149"
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">MRP Price (₹)</label>
                    <input
                      type="number"
                      value={newProdOrigPrice}
                      onChange={(e) => setNewProdOrigPrice(e.target.value)}
                      placeholder="199"
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Initial Stock</label>
                    <input
                      type="number"
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      placeholder="25"
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Image URL (Optional)</label>
                  <input
                    type="url"
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Crispy, fresh, high quality..."
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="vegCheckbox"
                    checked={newProdIsVeg}
                    onChange={(e) => setNewProdIsVeg(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="vegCheckbox" className="font-bold text-slate-700">
                    Pure Vegetarian Item
                  </label>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Add Khata Customer */}
        {showAddCustomerModal && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-extrabold text-base text-slate-900">Add Customer to Digital Khata</h3>
                <button
                  onClick={() => setShowAddCustomerModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateKhataCustomer} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="e.g. Mukesh Kumar"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Address</label>
                  <input
                    type="text"
                    value={newCustAddress}
                    onChange={(e) => setNewCustAddress(e.target.value)}
                    placeholder="e.g. Lane 2, Sector 5"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Opening Udhari / Due (₹)</label>
                  <input
                    type="number"
                    value={newCustInitialDue}
                    onChange={(e) => setNewCustInitialDue(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Notes / Tag</label>
                  <input
                    type="text"
                    value={newCustNotes}
                    onChange={(e) => setNewCustNotes(e.target.value)}
                    placeholder="e.g. Clears monthly, known customer"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCustomerModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold"
                  >
                    Create Khata Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Record Transaction (Udhari / Jama) */}
        {selectedKhataCustId && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-sm shadow-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-extrabold text-base text-slate-900">
                  {txType === 'credit' ? 'Record Udhari (+ Credit)' : 'Record Payment (- Jama)'}
                </h3>
                <button
                  onClick={() => setSelectedKhataCustId(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTx} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transaction Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTxType('credit')}
                      className={`p-2 rounded-xl font-bold text-center border ${
                        txType === 'credit'
                          ? 'border-rose-500 bg-rose-50 text-rose-800'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      + Udhari (Credit)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTxType('payment')}
                      className={`p-2 rounded-xl font-bold text-center border ${
                        txType === 'payment'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      - Jama (Payment)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    placeholder="500"
                    className="w-full text-lg font-black px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={txDesc}
                    onChange={(e) => setTxDesc(e.target.value)}
                    placeholder={txType === 'credit' ? 'Items taken / order bill' : 'Cash or UPI payment'}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedKhataCustId(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-2.5 rounded-xl text-white font-extrabold ${
                      txType === 'credit' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    Confirm Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
