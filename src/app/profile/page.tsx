'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore } from '@/lib/store';
import { 
  Package, 
  Truck, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Wallet
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { orders: localOrders, purchasedTotal } = useCartStore();
  const [syncedOrders, setSyncedOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const syncOrders = async () => {
      try {
        // Fetch ALL orders from server to find updates for THIS user's orders
        const res = await fetch('/api/orders');
        const allServerOrders = await res.json();
        
        // Filter server orders to only include IDs that exist in the user's local history
        const localIds = localOrders.map(o => o.id);
        const updatedOrders = allServerOrders.filter((so: any) => localIds.includes(so.id));
        
        // If server has more info (like status/tracking), use it. 
        // Otherwise fallback to local orders if server is empty/missing
        if (updatedOrders.length > 0) {
          setSyncedOrders(updatedOrders.reverse()); // Newest first
        } else {
          setSyncedOrders([...localOrders].reverse());
        }
      } catch (e) {
        setSyncedOrders([...localOrders].reverse());
      } finally {
        setLoading(false);
      }
    };

    syncOrders();
  }, [localOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Shipped': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Delivered': return 'text-green-600 bg-green-50 border-green-100';
      case 'Hold': return 'text-orange-600 bg-orange-50 border-orange-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Shipped': return <Truck size={14} />;
      case 'Delivered': return <CheckCircle2 size={14} />;
      case 'Hold': return <Clock size={14} />;
      default: return <Package size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-5xl mx-auto px-4 py-12 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Account Dashboard</h1>
            <p className="text-gray-500 mt-2 font-medium">Manage your orders and track live breaks.</p>
          </div>
          
          <div className="bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-pokemon-red/10 text-pokemon-red rounded-2xl flex items-center justify-center">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Total Spent</p>
              <p className="text-2xl font-black text-gray-900">${purchasedTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Order History */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Package size={20} className="text-pokemon-blue" />
              <h2 className="text-xl font-bold text-gray-900">Order History</h2>
              {loading && <span className="text-xs text-gray-400 animate-pulse font-medium ml-2">Syncing logistics...</span>}
            </div>

            {syncedOrders.length > 0 ? (
              <div className="space-y-4">
                {syncedOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm transition-hover hover:shadow-md transition-all">
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
                            <Package size={24} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{order.date}</p>
                            <h3 className="text-lg font-black text-gray-900">{order.id}</h3>
                          </div>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-xl p-2 border border-gray-100 relative group">
                            <img src={item.image} className="w-full h-full object-contain" alt="" />
                            <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                              {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-50">
                        <div className="flex gap-6">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Amount Paid</p>
                            <p className="text-lg font-black text-gray-900">${order.amount.toFixed(2)}</p>
                          </div>
                          {order.trackingNumber && (
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Tracking #</p>
                              <p className="text-sm font-bold text-pokemon-blue flex items-center gap-1 cursor-pointer hover:underline">
                                {order.trackingNumber} <ExternalLink size={12} />
                              </p>
                            </div>
                          )}
                        </div>
                        <button className="w-full sm:w-auto px-6 py-3 bg-gray-50 text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 flex items-center justify-center gap-2 transition-all">
                          View Receipt <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Logistics Progress (If shipped) */}
                    {order.status === 'Shipped' && (
                      <div className="bg-blue-50/50 px-6 py-4 flex items-center gap-4">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center animate-pulse">
                          <Truck size={16} />
                        </div>
                        <div className="flex-grow">
                          <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">Latest Status</p>
                          <p className="text-sm text-blue-700 font-medium italic">Package has been picked up by carrier and is in transit.</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard size={32} className="text-gray-200" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">You haven&apos;t placed any orders yet. Start your collection by joining our next live break!</p>
                <Link href="/" className="inline-flex items-center gap-2 bg-pokemon-red text-white px-8 py-4 rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-100">
                  Shop Now
                </Link>
              </div>
            )}
          </section>

          {/* Account Stats */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-md">
              <h3 className="font-bold text-lg mb-4">Live Break Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-medium">Total Packs Opened</span>
                  <span className="font-bold">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-medium">Rare Hits Found</span>
                  <span className="font-bold text-pokemon-red">5</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <span className="text-sm text-gray-500 font-medium">Current Status</span>
                  <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Ready for Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
