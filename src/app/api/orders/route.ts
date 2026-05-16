import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    }
  });
}

export async function POST(request: Request) {
  const order = await request.json();
  
  const { error } = await supabase
    .from('orders')
    .insert([{
      id: order.id,
      paypal_order_id: order.paypalOrderId,
      amount: order.amount,
      items: order.items,
      status: order.status,
      shipping_fee: order.shippingFee,
      customer: order.customer,
      date: order.date,
      tracking_number: order.trackingNumber || ''
    }]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const { orderId, updates } = await request.json();
  
  // Map frontend camelCase to database snake_case
  const dbUpdates: any = {};
  if (updates.status) dbUpdates.status = updates.status;
  if (updates.trackingNumber !== undefined) dbUpdates.tracking_number = updates.trackingNumber;

  const { error } = await supabase
    .from('orders')
    .update(dbUpdates)
    .eq('id', orderId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
