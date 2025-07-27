// /pages/api/orders/verify-payment.js
import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { paymentId, customerData, cartItems } = req.body;

  try {
    console.log('🔍 Verifying payment:', paymentId);

    // Step 1: Verify payment with PortOne
    const verifyResponse = await fetch(`https://api.portone.io/payments/${paymentId}`, {
      headers: {
        'Authorization': `PortOne ${process.env.PORTONE_API_SECRET}`,
      },
    });

    if (!verifyResponse.ok) {
      throw new Error(`PortOne API error: ${verifyResponse.status}`);
    }

    const paymentData = await verifyResponse.json();
    console.log('💳 Payment status:', paymentData.status);

    // Step 2: Check if payment is successful
    if (paymentData.status !== 'PAID') {
      return res.status(400).json({ 
        error: 'Payment not completed',
        status: paymentData.status 
      });
    }

    // Step 3: Calculate expected total and verify amount
    const expectedSubtotal = cartItems.reduce(
      (total, item) => total + (item.currentPrice * item.quantity), 0
    );
    const expectedShipping = expectedSubtotal >= 50000 ? 0 : 3000;
    const expectedTotal = expectedSubtotal + expectedShipping;

    if (paymentData.amount.total !== expectedTotal) {
      console.error('❌ Amount mismatch:', {
        expected: expectedTotal,
        received: paymentData.amount.total
      });
      return res.status(400).json({ 
        error: 'Payment amount verification failed',
        expected: expectedTotal,
        received: paymentData.amount.total
      });
    }

    console.log('✅ Payment verified successfully');

    // Step 4: Get next packaging number using RPC
    const { data: packagingNumber, error: packagingError } = await supabase
      .rpc('get_next_packaging_number');

    if (packagingError) {
      console.error('❌ Failed to get packaging number:', packagingError);
      throw new Error('Failed to assign packaging number');
    }

    console.log('📦 Assigned packaging number:', packagingNumber);

    // Step 5: Generate order IDs
    const groupOrderId = generateGroupOrderId();
    const orderDate = new Date().toISOString();

    // Step 6: Prepare order rows (one per cart item)
    const orderRows = cartItems.map((item, index) => {
      const individualOrderId = `${groupOrderId}-${index + 1}`;
      
      return {
        order_id: individualOrderId,
        group_order_id: groupOrderId,
        order_date: orderDate,
        customer_name: customerData.customerName,
        customer_email: customerData.customerEmail,
        customer_phone: customerData.customerPhone,
        shipping_address: buildShippingAddress(customerData),
        special_instructions: customerData.orderNotes || '',
        product_name: item.name,
        product_type: getProductType(item.slug), // Extract from slug or productId
        quantity: item.quantity.toString(),
        unit_price: item.currentPrice.toFixed(2),
        total_amount: (item.currentPrice * item.quantity).toFixed(2),
        order_status: 'order_received', // Initial status
        payment_status: 'paid',
        customization_data: item.customization || {},
        design_files: null,
        design_revisions: '0',
        internal_notes: `Payment ID: ${paymentId}`,
        created_at: orderDate,
        updated_at: orderDate,
        packaging_number: packagingNumber // Use the RPC-generated number
      };
    });

    console.log('📝 Inserting', orderRows.length, 'order rows with packaging number:', packagingNumber);

    // Step 7: Insert all order rows into Supabase
    const { data: orders, error } = await supabase
      .from('orders')
      .insert(orderRows)
      .select();

    if (error) {
      console.error('❌ Supabase error:', error);
      throw new Error(`Failed to create orders: ${error.message}`);
    }

    console.log('✅ Orders created successfully:', orders.length, 'rows');

    // Step 8: Return success response
    res.status(200).json({ 
      success: true, 
      orderId: groupOrderId, // Return group order ID for tracking
      groupOrderId: groupOrderId,
      packagingNumber: packagingNumber,
      orderCount: orders.length,
      totalAmount: expectedTotal,
      message: 'Payment verified and orders created successfully'
    });

  } catch (error) {
    console.error('❌ Payment verification error:', error);
    
    // Handle specific errors
    if (error.message?.includes('Payment not found')) {
      return res.status(404).json({ 
        error: 'Payment not found',
        details: 'The payment ID could not be found in PortOne'
      });
    }

    return res.status(500).json({ 
      error: 'Payment verification failed',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}

// Helper function to generate group order ID
function generateGroupOrderId() {
  const now = new Date();
  const year = now.getFullYear();
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  
  return `ORD-${year}-${timestamp}-${random}`;
}

// Helper function to build shipping address string
function buildShippingAddress(customerData) {
  let address = customerData.shippingAddress;
  
  if (customerData.shippingAddressDetail) {
    address += `, ${customerData.shippingAddressDetail}`;
  }
  
  if (customerData.shippingCity) {
    address += `, ${customerData.shippingCity}`;
  }
  
  if (customerData.shippingPostalCode) {
    address += ` ${customerData.shippingPostalCode}`;
  }
  
  return address;
}

// Helper function to determine product type from slug
function getProductType(slug) {
  // Map your product slugs to types based on your existing data
  const typeMapping = {
    'mug': 'mug',
    'mug-cup': 'mug', 
    'tshirt': 'tshirt',
    't-shirt': 'tshirt',
    'tote': 'tote',
    'tote-bag': 'tote',
    // Add more mappings as needed
  };

  // Try to find exact match first
  if (typeMapping[slug]) {
    return typeMapping[slug];
  }

  // Try to find partial match
  for (const [key, value] of Object.entries(typeMapping)) {
    if (slug.includes(key)) {
      return value;
    }
  }

  // Default fallback
  return 'custom';
}