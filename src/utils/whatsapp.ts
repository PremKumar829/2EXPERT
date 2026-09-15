import { Order, KhataCustomer } from '../types';

export const OWNER_WHATSAPP_NUMBER = '918340701002'; // +91 83407 01002

/**
 * Generates an official, beautifully formatted WhatsApp text invoice payload
 */
export function generateWhatsAppOrderInvoice(order: Order, ownerPhone: string = OWNER_WHATSAPP_NUMBER): { text: string; url: string } {
  // Format items list
  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.product.name}*\n   Qty: ${item.quantity} × ₹${item.product.price} = ₹${item.quantity * item.product.price}`
    )
    .join('\n');

  const paymentLabel =
    order.paymentMethod === 'cod'
      ? '💵 Cash on Delivery (COD)'
      : order.paymentMethod === 'upi'
      ? '📱 UPI on Delivery (GPay / PhonePe / Paytm)'
      : '📒 Digital Khata (Pay Later / Udhari)';

  const formattedDate = new Date(order.createdAt).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const invoiceText = `🧾 *TAX INVOICE & ORDER SUMMARY*
━━━━━━━━━━━━━━━━━━━━
🏪 *2EXPERT Quick Commerce*
_Expert Services Near You_
_"Jo saman chahiye, bas message kariye."_
━━━━━━━━━━━━━━━━━━━━
🆔 *Order ID:* #${order.id}
📅 *Date & Time:* ${formattedDate}
⏱️ *Est. Delivery:* ~${order.estimatedDeliveryMins} mins

👤 *CUSTOMER DETAILS:*
• *Name:* ${order.customerName}
• *Phone:* ${order.customerPhone}
• *Address:* ${order.deliveryAddress}
${order.landmark ? `• *Landmark:* ${order.landmark}\n` : ''}${order.orderNotes ? `• *Note:* ${order.orderNotes}\n` : ''}
📦 *ORDERED ITEMS (${order.items.length}):*
${itemsText}

━━━━━━━━━━━━━━━━━━━━
💰 *BILL BREAKDOWN:*
• Item Subtotal: ₹${order.subtotal}
• Delivery Charge: ${order.deliveryFee === 0 ? 'FREE (Special Offer)' : `₹${order.deliveryFee}`}
${order.discount > 0 ? `• Discount: -₹${order.discount}\n` : ''}• *GRAND TOTAL:* *₹${order.total}*
💳 *Payment Mode:* ${paymentLabel}
━━━━━━━━━━━━━━━━━━━━
🛵 *Status:* 🟢 Order Received & Verified
🙏 *Thank you for ordering with 2EXPERT!*
Direct helpline: +91 83407 01002`;

  const cleanPhone = ownerPhone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(invoiceText);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  return { text: invoiceText, url: whatsappUrl };
}

/**
 * Generates a polite, clear WhatsApp payment reminder message for Khata customers
 */
export function generateKhataReminderMessage(customer: KhataCustomer): { text: string; url: string } {
  const message = `Namaste ${customer.name} ji 🙏,
This is a gentle reminder from *2EXPERT Quick Commerce*.

As per our digital store ledger, your pending balance is:
💰 *Pending Khata Dues:* *₹${customer.totalDue}*

Please clear the dues via UPI (GPay/PhonePe/Paytm to +91 83407 01002) or cash on your next visit.

Thank you for your continuous support!
*2EXPERT Team* - Jo saman chahiye, bas message kariye.`;

  const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encoded}`;

  return { text: message, url };
}
