import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  StoreSettings,
  KhataCustomer,
  KhataTransaction,
  PaymentMethod
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_STORE_SETTINGS,
  INITIAL_KHATA_CUSTOMERS
} from '../data/initialData';
import { playOrderNotificationSound } from '../utils/audio';
import { generateWhatsAppOrderInvoice } from '../utils/whatsapp';

interface AppContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Orders
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  placeOrder: (customerDetails: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    landmark?: string;
    paymentMethod: PaymentMethod;
    orderNotes?: string;
  }) => { order: Order; whatsappUrl: string };
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Store Settings
  storeSettings: StoreSettings;
  updateStoreSettings: (updates: Partial<StoreSettings>) => void;
  toggleStoreOpen: () => void;

  // Digital Khata
  khataCustomers: KhataCustomer[];
  addKhataCustomer: (customer: Omit<KhataCustomer, 'id' | 'transactions' | 'lastUpdated'>) => void;
  addKhataTransaction: (customerId: string, transaction: Omit<KhataTransaction, 'id' | 'customerId' | 'date'>) => void;

  // Admin Auth & Controls
  isAdminAuthenticated: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  audioAlertsEnabled: boolean;
  setAudioAlertsEnabled: (enabled: boolean) => void;
  unreadOrdersCount: number;
  markOrdersAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: '2expert_products_v1',
  ORDERS: '2expert_orders_v1',
  SETTINGS: '2expert_settings_v1',
  KHATA: '2expert_khata_v1',
  ACTIVE_ORDER_ID: '2expert_active_order_id_v1',
  ADMIN_AUTH: '2expert_admin_auth_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage fallbacks
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
  });

  const [khataCustomers, setKhataCustomers] = useState<KhataCustomer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.KHATA);
    return saved ? JSON.parse(saved) : INITIAL_KHATA_CUSTOMERS;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_ORDER_ID) || (INITIAL_ORDERS[0]?.id ?? null);
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState<boolean>(true);
  const [unreadOrdersCount, setUnreadOrdersCount] = useState<number>(1);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.KHATA, JSON.stringify(khataCustomers));
  }, [khataCustomers]);

  useEffect(() => {
    if (activeOrderId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ORDER_ID, activeOrderId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_ORDER_ID);
    }
  }, [activeOrderId]);

  // Derived Active Order
  const activeOrder = orders.find(o => o.id === activeOrderId) || null;

  // Cart operations
  const addToCart = (product: Product) => {
    if (!product.inStock) return;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Place Order
  const placeOrder = (details: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    landmark?: string;
    paymentMethod: PaymentMethod;
    orderNotes?: string;
  }) => {
    const subtotal = cartTotal;
    const deliveryFee =
      subtotal >= storeSettings.freeDeliveryThreshold ? 0 : storeSettings.standardDeliveryFee;
    const total = subtotal + deliveryFee;

    const newOrderId = `2EXP-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const estDeliveryTime = new Date(
      now.getTime() + storeSettings.estimatedTimeMins * 60000
    ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: newOrderId,
      customerName: details.customerName,
      customerPhone: details.customerPhone,
      deliveryAddress: details.deliveryAddress,
      landmark: details.landmark,
      items: [...cart],
      subtotal,
      deliveryFee,
      discount: 0,
      total,
      status: 'placed',
      paymentMethod: details.paymentMethod,
      orderNotes: details.orderNotes,
      createdAt: now.toISOString(),
      estimatedDeliveryMins: storeSettings.estimatedTimeMins,
      estimatedDeliveryTime: estDeliveryTime
    };

    // If payment method is Khata, automatically link or append to khata ledger
    if (details.paymentMethod === 'khata') {
      const cleanPhone = details.customerPhone.replace(/[^0-9]/g, '');
      setKhataCustomers(prev => {
        const existing = prev.find(
          c => c.phone.replace(/[^0-9]/g, '').slice(-10) === cleanPhone.slice(-10)
        );

        const newTx: KhataTransaction = {
          id: `tx-${Date.now()}`,
          customerId: existing ? existing.id : `khata-${Date.now()}`,
          type: 'credit',
          amount: total,
          description: `Order #${newOrderId} (Quick Delivery)`,
          date: now.toISOString(),
          orderId: newOrderId
        };

        if (existing) {
          return prev.map(c =>
            c.id === existing.id
              ? {
                  ...c,
                  totalDue: c.totalDue + total,
                  lastUpdated: now.toISOString(),
                  transactions: [newTx, ...c.transactions]
                }
              : c
          );
        } else {
          const newCust: KhataCustomer = {
            id: newTx.customerId,
            name: details.customerName,
            phone: details.customerPhone,
            address: details.deliveryAddress,
            totalDue: total,
            notes: 'Created automatically from Quick Order with Pay Later/Khata',
            transactions: [newTx],
            lastUpdated: now.toISOString()
          };
          return [newCust, ...prev];
        }
      });
    }

    // Update orders & active order
    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(newOrderId);
    setUnreadOrdersCount(prev => prev + 1);
    clearCart();

    // Trigger audio notification
    if (audioAlertsEnabled) {
      playOrderNotificationSound();
    }

    // Generate WhatsApp payload & direct link
    const { url } = generateWhatsAppOrderInvoice(newOrder, storeSettings.ownerPhone);

    return { order: newOrder, whatsappUrl: url };
  };

  // Update order status (Admin & Customer synchronization)
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(order => (order.id === orderId ? { ...order, status } : order))
    );
  };

  // Product management
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...prodData,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(prod => (prod.id === id ? { ...prod, ...updates } : prod))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(prod => prod.id !== id));
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  // Store settings & Shop Open/Closed toggle
  const updateStoreSettings = (updates: Partial<StoreSettings>) => {
    setStoreSettings(prev => ({ ...prev, ...updates }));
  };

  const toggleStoreOpen = () => {
    setStoreSettings(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };

  // Digital Khata management
  const addKhataCustomer = (custData: Omit<KhataCustomer, 'id' | 'transactions' | 'lastUpdated'>) => {
    const newCustomer: KhataCustomer = {
      ...custData,
      id: `khata-${Date.now()}`,
      transactions: custData.totalDue > 0 ? [
        {
          id: `tx-init-${Date.now()}`,
          customerId: `khata-${Date.now()}`,
          type: 'credit',
          amount: custData.totalDue,
          description: 'Opening balance / Previous due',
          date: new Date().toISOString()
        }
      ] : [],
      lastUpdated: new Date().toISOString()
    };
    setKhataCustomers(prev => [newCustomer, ...prev]);
  };

  const addKhataTransaction = (
    customerId: string,
    txData: Omit<KhataTransaction, 'id' | 'customerId' | 'date'>
  ) => {
    const now = new Date().toISOString();
    const newTx: KhataTransaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      customerId,
      date: now
    };

    setKhataCustomers(prev =>
      prev.map(c => {
        if (c.id !== customerId) return c;
        const balanceChange = txData.type === 'credit' ? txData.amount : -txData.amount;
        return {
          ...c,
          totalDue: Math.max(0, c.totalDue + balanceChange),
          lastUpdated: now,
          transactions: [newTx, ...c.transactions]
        };
      })
    );
  };

  // Admin authentication (Default PIN: 2026)
  const loginAdmin = (pin: string): boolean => {
    if (pin.trim() === '2026' || pin.trim() === 'admin') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  };

  const markOrdersAsRead = () => {
    setUnreadOrdersCount(0);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        orders,
        activeOrder,
        setActiveOrder: (order) => setActiveOrderId(order ? order.id : null),
        placeOrder,
        updateOrderStatus,
        storeSettings,
        updateStoreSettings,
        toggleStoreOpen,
        khataCustomers,
        addKhataCustomer,
        addKhataTransaction,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        audioAlertsEnabled,
        setAudioAlertsEnabled,
        unreadOrdersCount,
        markOrdersAsRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
