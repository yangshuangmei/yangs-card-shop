'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore } from '@/lib/store';
import { Trash2, ShoppingBag, ArrowRight, Truck, Info, History, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { PayPalButtons } from "@paypal/react-paypal-js";

export default function CartPage() {
  const { items, removeItem, clearCart, purchasedTotal, addPurchasedTotal, addOrder } = useCartStore();
  const [settings, setSettings] = useState({ freeShippingThreshold: 99, shippingFee: 15 });
  const [isHold, setIsHold] = useState(false);
  
  // Customer Info
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.settings) setSettings(data.settings);
      } catch (e) {}
    }
    fetchSettings();
  }, []);
  
  const currentSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCombined = currentSubtotal + purchasedTotal; 
  
  const isFreeEligible = totalCombined >= settings.freeShippingThreshold;
  const shipping = items.length > 0 ? (isFreeEligible || isHold ? 0 : settings.shippingFee) : 0;
  const total = currentSubtotal + shipping;

  const processOrder = async (paypalOrderId: string = '') => {
    const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newOrder = {
      id: orderId,
      paypalOrderId: paypalOrderId,
      date: new Date().toLocaleString(),
      amount: total,
      items: [...items],
      status: isHold ? 'Hold' : 'Pending',
      shippingFee: shipping,
      customer: { ...customer }
    };

    try {
      // 1. Save to Server (for Admin)
      await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(newOrder),
        headers: { 'Content-Type': 'application/json' },
      });

      // 2. Save to Local (for User Profile)
      addOrder(newOrder as any);
      addPurchasedTotal(currentSubtotal);
      
      alert(`Checkout successful! Order ${orderId} has been created.`);
      clearCart();
    } catch (e) {
      alert("Checkout failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-6xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
          Checkout <span className="text-gray-400 font-medium">({items.length} items)</span>
        </h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info Form */}
              <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <UserCircle size={20} className="text-pokemon-blue" />
                  <h2 className="text-xl font-bold">Shipping Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Ash Ketchum"
                      value={customer.name}
                      onChange={(e) => setCustomer({...customer, name: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Email / Contact</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ash@pallet.com"
                      value={customer.email}
                      onChange={(e) => setCustomer({...customer, email: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Delivery Address</label>
                    <textarea 
                      placeholder="Full address for shipping..."
                      value={customer.address}
                      onChange={(e) => setCustomer({...customer, address: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-100 outline-none h-24 resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* Items List */}
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl flex gap-4 border border-gray-100">
                    <div className="w-24 h-24 bg-gray-50 rounded-xl flex-shrink-0 p-2">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900">{item.name}</h3>
                          {item.variantName && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase">Spec: {item.variantName}</span>}
                        </div>
                        <button onClick={() => removeItem(item.id, item.variantName)} className="text-gray-300 hover:text-pokemon-red transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <span className="text-sm font-bold text-gray-400">Qty: {item.quantity}</span>
                        <span className="font-black text-xl">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 h-fit space-y-6 shadow-sm">
                <h3 className="font-bold text-xl">Order Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-500 font-bold text-sm">
                    <span>Subtotal</span>
                    <span>${currentSubtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-bold text-sm">Shipping Fee</span>
                      <span className={`font-black ${shipping === 0 ? 'text-green-500' : 'text-gray-900'}`}>
                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>

                    {!isFreeEligible && !isHold && (
                      <div className="bg-blue-50 p-4 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2 text-pokemon-blue">
                          <Truck size={16} />
                          <span className="text-xs font-black uppercase tracking-wider">Free Shipping Progress</span>
                        </div>
                        <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden mb-2">
                          <div 
                            className="bg-pokemon-blue h-full transition-all duration-1000" 
                            style={{ width: `${Math.min(100, (totalCombined / settings.freeShippingThreshold) * 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-[10px] text-pokemon-blue font-bold">
                          Add <span className="underline">${(settings.freeShippingThreshold - totalCombined).toFixed(2)}</span> more to get FREE shipping!
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total to Pay Now</span>
                    <span className="text-3xl font-black text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer border border-transparent hover:border-gray-200 transition-all">
                    <input 
                      type="checkbox" 
                      checked={isHold} 
                      onChange={(e) => setIsHold(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-pokemon-red focus:ring-pokemon-red"
                    />
                    <div>
                      <p className="text-[11px] font-black uppercase text-gray-900 leading-tight">Combine with pending orders</p>
                      <p className="text-[10px] text-gray-500">Hold my package & ship later ($0 shipping fee now)</p>
                    </div>
                  </label>
                </div>

                <div className="pt-2">
                  {!customer.name || !customer.address ? (
                    <button 
                      onClick={() => alert("Please fill in your shipping details first!")}
                      className="w-full bg-gray-200 text-gray-500 py-5 rounded-2xl font-black text-lg cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Fill Details to Pay <ArrowRight size={20} />
                    </button>
                  ) : (
                    <div className="relative z-0">
                      <PayPalButtons 
                        style={{ layout: "vertical", shape: "pill", label: "pay" }}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [
                              {
                                amount: {
                                  currency_code: "USD",
                                  value: total.toFixed(2),
                                },
                                description: `Order for ${customer.name}`,
                              },
                            ],
                          });
                        }}
                        onApprove={async (data, actions) => {
                          if (actions.order) {
                            const details = await actions.order.capture();
                            await processOrder(details.id);
                          }
                        }}
                        onError={(err) => {
                          console.error("PayPal Error:", err);
                          alert("PayPal Checkout could not be initialized.");
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Trust Icons */}
                <div className="pt-2">
                  <p className="text-[9px] font-bold text-gray-400 uppercase text-center mb-3 tracking-widest">Guaranteed Safe Checkout</p>
                  <div className="flex justify-center items-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="PayPal" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="Visa" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5" alt="Mastercard" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_logo%2C_revised_2016.svg" className="h-4" alt="Stripe" />
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                <div className="flex items-center gap-2 text-orange-600 mb-2">
                  <Info size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Live Stream Policy</span>
                </div>
                <p className="text-[10px] text-orange-800 leading-relaxed font-medium text-center">
                  Orders will be opened live. Once opened, items are <span className="font-black underline">NON-REFUNDABLE</span>.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
            <ShoppingBag size={64} className="mx-auto text-gray-200 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <Link href="/" className="inline-flex items-center gap-2 bg-pokemon-blue text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-600 transition-all">Back to Shop</Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
