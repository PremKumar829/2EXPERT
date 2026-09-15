export type OrderStatus = 'placed' | 'packing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export type PaymentMethod = 'cod' | 'upi' | 'khata';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  unit: string;
  image: string;
  inStock: boolean;
  stockCount: number;
  description: string;
  isVeg: boolean;
  discountPercentage: number;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  landmark?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  orderNotes?: string;
  createdAt: string;
  estimatedDeliveryMins: number;
  estimatedDeliveryTime: string;
}

export type TransactionType = 'credit' | 'payment';

export interface KhataTransaction {
  id: string;
  customerId: string;
  type: TransactionType; // 'credit' = customer borrowed (udhari increased), 'payment' = customer paid (udhari decreased)
  amount: number;
  description: string;
  date: string;
  orderId?: string;
}

export interface KhataCustomer {
  id: string;
  name: string;
  phone: string;
  address: string;
  totalDue: number; // Positive means customer owes money
  notes?: string;
  transactions: KhataTransaction[];
  lastUpdated: string;
}

export interface StoreSettings {
  isOpen: boolean;
  closedMessage: string;
  ownerPhone: string; // e.g., '+91 83407 01002'
  storeAddress: string;
  deliveryRadiusKm: number;
  minOrderValue: number;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  estimatedTimeMins: number;
  noticeBanner: string;
}
