// /pages/api/orders/verify-payment.js
import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { paymentId, orderId, customerData, cartItems } = req.body;

  try {
    // Verify payment with PortOne server
    const verifyResponse = await fetch(`https://api.portone.io/payments/${paymentId}`, {
      headers: {
        'Authorization': `PortOne ${process.env.PORTONE_API_SECRET}`,
      },
    });

    const paymentData = await verifyResponse.json();

    if (paymentData.status === 'PAID') {
      // Payment is verified - create order in database
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          order_id: orderId,
          payment_id: paymentId,
          customer_name: customerData.customerName,
          customer_email: customerData.customerEmail,
          customer_phone: customerData.customerPhone,
          shipping_address: customerData.shippingAddress,
          shipping_address_detail: customerData.shippingAddressDetail,
          shipping_city: customerData.shippingCity,
          shipping_postal_code: customerData.shippingPostalCode,
          order_notes: customerData.orderNotes,
          total_amount: paymentData.amount.total,
          payment_status: 'paid',
          order_status: 'confirmed',
          cart_items: cartItems,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new Error('Failed to create order');
      }

      res.status(200).json({ 
        success: true, 
        orderId: order.order_id,
        message: 'Payment verified and order created' 
      });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
}