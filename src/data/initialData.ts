import { Product, StoreSettings, KhataCustomer, Order } from '../types';

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  isOpen: true,
  closedMessage: "Currently Closed — We open back at 7:00 AM! For urgent orders, WhatsApp us.",
  ownerPhone: "+91 83407 01002",
  storeAddress: "Shop No. 4, Main Market Road, Near City Center",
  deliveryRadiusKm: 5,
  minOrderValue: 99,
  freeDeliveryThreshold: 199,
  standardDeliveryFee: 25,
  estimatedTimeMins: 15,
  noticeBanner: "⚡ Superfast 12-15 Min Delivery • Free delivery above ₹199 • Jo saman chahiye, bas message kariye!"
};

export const INITIAL_PRODUCTS: Product[] = [
  // Fast Food & Pizza
  {
    id: 'prod-piz-1',
    name: 'Spicy Affair Pizza (Fresh Hand-Tossed 8")',
    category: 'Fast Food & Pizza',
    price: 189,
    originalPrice: 249,
    unit: '1 Regular 8" Box',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 18,
    description: 'Loaded with red paprika, spicy jalapenos, crunchy capsicum, golden corn & 100% mozzarella cheese blend.',
    isVeg: true,
    discountPercentage: 24,
    badge: 'Chef Special'
  },
  {
    id: 'prod-piz-2',
    name: 'Farmhouse Cheese Burst Pizza (8")',
    category: 'Fast Food & Pizza',
    price: 219,
    originalPrice: 279,
    unit: '1 Regular 8" Box',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 12,
    description: 'Oozing liquid cheese core topped with diced onions, tomatoes, crisp bell peppers & mushrooms.',
    isVeg: true,
    discountPercentage: 21,
    badge: 'Bestseller'
  },
  {
    id: 'prod-piz-3',
    name: 'Crispy French Fries (Peri-Peri Sprinkled)',
    category: 'Fast Food & Pizza',
    price: 89,
    originalPrice: 119,
    unit: '150g Box',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 30,
    description: 'Golden fried crispy potato fingers tossed in tangy, fiery peri-peri seasoning with cheesy dip.',
    isVeg: true,
    discountPercentage: 25,
    badge: 'Hot Snack'
  },
  {
    id: 'prod-piz-4',
    name: 'Paneer Makhani Grilled Burger',
    category: 'Fast Food & Pizza',
    price: 119,
    originalPrice: 149,
    unit: '1 Burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 22,
    description: 'Rich cottage paneer patty infused with creamy makhani sauce, sliced onions and butter toasted brioche bun.',
    isVeg: true,
    discountPercentage: 20
  },

  // Snacks & Namkeen
  {
    id: 'prod-snk-1',
    name: 'Bikaji Bhujia Sev Traditional Bikaneri',
    category: 'Snacks & Namkeen',
    price: 120,
    originalPrice: 140,
    unit: '400g Pouch',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 45,
    description: 'Authentic spicy crispy moth bean flour fried vermicelli seasoned with clove, black pepper and salt.',
    isVeg: true,
    discountPercentage: 14,
    badge: 'Popular'
  },
  {
    id: 'prod-snk-2',
    name: 'Bikaji Rasgulla Sweet Tin Can',
    category: 'Snacks & Namkeen',
    price: 210,
    originalPrice: 240,
    unit: '1kg Tin Can',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 15,
    description: 'Spongy soft white cottage cheese balls soaked in chilled light sugar syrup. Ready to serve sweet dessert.',
    isVeg: true,
    discountPercentage: 12,
    badge: 'Sweet Treat'
  },
  {
    id: 'prod-snk-3',
    name: 'Haldiram’s Aloo Bhujia Namkeen',
    category: 'Snacks & Namkeen',
    price: 95,
    originalPrice: 110,
    unit: '400g Pouch',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 35,
    description: 'Crispy mint-flavored potato noodles infused with spice blend. Ideal teatime Indian munch.',
    isVeg: true,
    discountPercentage: 13
  },
  {
    id: 'prod-snk-4',
    name: 'Kurkure Masala Munch Crunchy Snacks',
    category: 'Snacks & Namkeen',
    price: 20,
    originalPrice: 20,
    unit: '85g Pack',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 60,
    description: 'Classic crunchy corn curls tossed in chatpata Indian spices.',
    isVeg: true,
    discountPercentage: 0
  },

  // Health Drinks & Beverages
  {
    id: 'prod-bev-1',
    name: 'Bournvita Chocolate Nutrition Drink',
    category: 'Beverages & Dairy',
    price: 225,
    originalPrice: 260,
    unit: '500g Jar',
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 20,
    description: 'Malted food drink loaded with Vitamin D, Iron, Vitamin C & B12 for active strength & immunity.',
    isVeg: true,
    discountPercentage: 13,
    badge: 'Top Nutrition'
  },
  {
    id: 'prod-bev-2',
    name: 'Horlicks Classic Malt Health Drink',
    category: 'Beverages & Dairy',
    price: 235,
    originalPrice: 270,
    unit: '500g Refill Pack',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 18,
    description: 'Clinically proven malted drink supporting taller, stronger, sharper growth with bio-nutrients.',
    isVeg: true,
    discountPercentage: 13
  },
  {
    id: 'prod-bev-3',
    name: 'Amul Taaza Homogenised Toned Milk',
    category: 'Beverages & Dairy',
    price: 72,
    originalPrice: 75,
    unit: '1L Tetra Pack',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 40,
    description: 'Pure, fresh homogenized toned dairy milk with 3.0% fat and 8.5% SNF. No boiling needed.',
    isVeg: true,
    discountPercentage: 4,
    badge: 'Daily Essential'
  },
  {
    id: 'prod-bev-4',
    name: 'Thums Up Charged Soft Drink',
    category: 'Beverages & Dairy',
    price: 40,
    originalPrice: 40,
    unit: '750ml Pet Bottle',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 30,
    description: 'Strong, fizzy cola taste packed with bold Indian punch. Chilled bottle delivery.',
    isVeg: true,
    discountPercentage: 0
  },

  // Groceries & Kitchen Staples
  {
    id: 'prod-groc-1',
    name: 'Fortune Sunlite Refined Sunflower Oil',
    category: 'Groceries & Staples',
    price: 135,
    originalPrice: 165,
    unit: '1 Litre Pouch',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 25,
    description: 'Enriched with Vitamin A and D. Light on stomach and healthy for family cooking.',
    isVeg: true,
    discountPercentage: 18,
    badge: 'Best Deal'
  },
  {
    id: 'prod-groc-2',
    name: 'Aashirvaad Superior Shudh Chakki Atta',
    category: 'Groceries & Staples',
    price: 245,
    originalPrice: 280,
    unit: '5kg Bag',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 15,
    description: '100% whole wheat flour crafted with traditional 4-step stone chakki grinding for rotis.',
    isVeg: true,
    discountPercentage: 12
  },
  {
    id: 'prod-groc-3',
    name: 'India Gate Basmati Rice (Feast Rozzana)',
    category: 'Groceries & Staples',
    price: 110,
    originalPrice: 135,
    unit: '1kg Pouch',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 28,
    description: 'Aromatic long slender grains perfect for biryani, pulao and everyday fragrant rice meals.',
    isVeg: true,
    discountPercentage: 18
  },
  {
    id: 'prod-groc-4',
    name: 'Tata Salt Vacuum Evaporated Iodised',
    category: 'Groceries & Staples',
    price: 28,
    originalPrice: 30,
    unit: '1kg Pouch',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 50,
    description: 'India ka namak - high purity iodised crystal salt promoting mental development in children.',
    isVeg: true,
    discountPercentage: 6
  },

  // Daily Needs & Household
  {
    id: 'prod-dly-1',
    name: 'Dettol Original Bathing Soap (Pack of 4)',
    category: 'Daily Needs',
    price: 175,
    originalPrice: 210,
    unit: '4 x 125g Pack',
    image: 'https://images.unsplash.com/photo-1607006314185-c496152a5592?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 20,
    description: '100% better germ protection with trusted pine fragrance for everyday family bathing hygiene.',
    isVeg: true,
    discountPercentage: 16
  },
  {
    id: 'prod-dly-2',
    name: 'Colgate Strong Teeth Calcium Dental Cream',
    category: 'Daily Needs',
    price: 115,
    originalPrice: 130,
    unit: '200g Tube',
    image: 'https://images.unsplash.com/photo-1559591937-e1032d8479e0?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 30,
    description: 'Strengthens teeth with Amino Shakti formula, prevents cavity decay and freshens breath.',
    isVeg: true,
    discountPercentage: 11
  },
  {
    id: 'prod-dly-3',
    name: 'Vim Dishwash Gel Lemon Anti-Germs',
    category: 'Daily Needs',
    price: 145,
    originalPrice: 170,
    unit: '750ml Bottle',
    image: 'https://images.unsplash.com/photo-1585670149967-b4f4da88cc9f?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 25,
    description: 'Concentrated gel with power of 100 lemons removing tough grease effortlessly from utensils.',
    isVeg: true,
    discountPercentage: 14
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: '2EXP-9042',
    customerName: 'Rohit Raj',
    customerPhone: '+91 98350 44122',
    deliveryAddress: 'Flat 302, Sunrise Heights, Sector 14',
    landmark: 'Opposite Dominoes',
    items: [
      {
        product: INITIAL_PRODUCTS[0], // Spicy affair pizza
        quantity: 2
      },
      {
        product: INITIAL_PRODUCTS[2], // French fries
        quantity: 1
      },
      {
        product: INITIAL_PRODUCTS[10], // Thums Up
        quantity: 2
      }
    ],
    subtotal: 547,
    deliveryFee: 0,
    discount: 0,
    total: 547,
    status: 'out_for_delivery',
    paymentMethod: 'upi',
    orderNotes: 'Ringing bell twice, deliver quickly please.',
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    estimatedDeliveryMins: 12,
    estimatedDeliveryTime: new Date(Date.now() + 1000 * 60 * 6).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: '2EXP-9041',
    customerName: 'Pooja Kashyap',
    customerPhone: '+91 94711 82301',
    deliveryAddress: 'House #42, Lane 3, Krishna Nagar',
    landmark: 'Near Hanuman Mandir',
    items: [
      {
        product: INITIAL_PRODUCTS[4], // Bikaji Bhujia
        quantity: 1
      },
      {
        product: INITIAL_PRODUCTS[7], // Bournvita
        quantity: 1
      },
      {
        product: INITIAL_PRODUCTS[9], // Amul Taaza Milk
        quantity: 3
      }
    ],
    subtotal: 561,
    deliveryFee: 0,
    discount: 0,
    total: 561,
    status: 'packing',
    paymentMethod: 'cod',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    estimatedDeliveryMins: 15,
    estimatedDeliveryTime: new Date(Date.now() + 1000 * 60 * 10).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

export const INITIAL_KHATA_CUSTOMERS: KhataCustomer[] = [
  {
    id: 'khata-cust-1',
    name: 'Ramesh Sharma (Contractor)',
    phone: '+91 98351 12345',
    address: 'Plot 18, Block B, Main Road',
    totalDue: 1450,
    notes: 'Regular local customer, clears balance on every 1st & 15th of the month.',
    lastUpdated: '2026-09-12T11:30:00Z',
    transactions: [
      {
        id: 'tx-101',
        customerId: 'khata-cust-1',
        type: 'credit',
        amount: 850,
        description: 'Monthly grocery staples (Atta 5kg + Oil 2L + Horlicks)',
        date: '2026-09-08T14:20:00Z',
        orderId: '2EXP-8812'
      },
      {
        id: 'tx-102',
        customerId: 'khata-cust-1',
        type: 'credit',
        amount: 600,
        description: 'Evening snacks and sweets order (Bikaji Rasgulla + Namkeen)',
        date: '2026-09-12T11:30:00Z',
        orderId: '2EXP-8899'
      }
    ]
  },
  {
    id: 'khata-cust-2',
    name: 'Dr. Vivek Anand (Clinic)',
    phone: '+91 94312 98765',
    address: 'Anand Medicare, Near Gandhi Chowk',
    totalDue: 820,
    notes: 'Daily milk, beverages, Dettol soaps and biscuits for staff.',
    lastUpdated: '2026-09-14T09:15:00Z',
    transactions: [
      {
        id: 'tx-201',
        customerId: 'khata-cust-2',
        type: 'credit',
        amount: 1500,
        description: 'Weekly clinic supplies & tea supplies',
        date: '2026-09-01T10:00:00Z'
      },
      {
        id: 'tx-202',
        customerId: 'khata-cust-2',
        type: 'payment',
        amount: 1000,
        description: 'UPI Payment received via PhonePe',
        date: '2026-09-07T16:45:00Z'
      },
      {
        id: 'tx-203',
        customerId: 'khata-cust-2',
        type: 'credit',
        amount: 320,
        description: 'Dettol soaps pack & Amul milk',
        date: '2026-09-14T09:15:00Z'
      }
    ]
  },
  {
    id: 'khata-cust-3',
    name: 'Priya Verma',
    phone: '+91 97092 34567',
    address: 'Flat 104, Green Valley Apartments',
    totalDue: 340,
    notes: 'Neighbor customer, pays online.',
    lastUpdated: '2026-09-13T19:20:00Z',
    transactions: [
      {
        id: 'tx-301',
        customerId: 'khata-cust-3',
        type: 'credit',
        amount: 340,
        description: 'Emergency grocery late night delivery',
        date: '2026-09-13T19:20:00Z'
      }
    ]
  }
];
