'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Save, Plus, Trash2, ChevronDown, ChevronUp, Truck, 
  Image as ImageIcon, AlignLeft, List, Package, User, 
  ExternalLink, Search, Clock, CheckCircle2, Lock, Settings, UserCircle
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [settings, setSettings] = useState({ 
    freeShippingThreshold: 99, 
    shippingFee: 15, 
    adminPassword: 'admin', 
    heroImage: '', 
    heroTitle: '', 
    heroSubtitle: '',
    contactWhatsApp: '',
    contactEmail: '',
    contactTikTok: '',
    contactInstagram: '',
    liveLink: '',
    categoryStandard: 'Standard Breaks',
    categoryGameplay: 'Game Modes',
    categorySpecial: 'Special Drops'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchData();
  }, [activeTab]);

  const uniqueDates = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    const dates = orders.map(o => {
      if (!o || !o.date || typeof o.date !== 'string') return '';
      // Extract YYYY-MM-DD from the date string
      const match = o.date.match(/\d{4}-\d{2}-\d{2}/);
      return match ? match[0] : o.date.split(',')[0].trim();
    }).filter(d => d !== '');
    return Array.from(new Set(dates)).sort((a, b) => b.localeCompare(a));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    
    return orders.filter(order => {
      if (!order) return false;
      const search = searchQuery.toLowerCase();
      const matchesSearch = 
        (order.id?.toLowerCase() || '').includes(search) ||
        (order.customer?.name?.toLowerCase() || '').includes(search) ||
        (order.customer?.email?.toLowerCase() || '').includes(search) ||
        (order.tracking_number?.toLowerCase() || order.trackingNumber?.toLowerCase() || '').includes(search);
      
      const matchesDate = !dateFilter || (order.date && order.date.includes(dateFilter));
      
      return matchesSearch && matchesDate;
    });
  }, [orders, searchQuery, dateFilter]);


  const fetchData = async () => {
    try {
      setLoading(true);
      const prodRes = await fetch(`/api/products?t=${Date.now()}`);
      const prodData = await prodRes.json();
      setProducts(prodData.products || []);
      setSettings(prodData.settings || { freeShippingThreshold: 99, shippingFee: 15, adminPassword: 'admin' });

      const orderRes = await fetch(`/api/orders?t=${Date.now()}`);
      const orderData = await orderRes.json();
      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch (error) {
      console.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProducts = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify({ products, settings }),
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save');
      }
      
      alert('Catalog saved successfully!');
    } catch (error: any) {
      alert(`Error saving: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    if (status === 'Shipped' || status === 'Delivered') {
      if (!confirm(`Are you sure you want to change order status to ${status}?`)) return;
    }
    await fetch('/api/orders', {
      method: 'PATCH',
      body: JSON.stringify({ orderId, updates: { status } }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchData();
  };

  const updateOrderTracking = async (orderId: string, trackingNumber: string) => {
    if (!trackingNumber) return;
    if (!confirm(`Confirm shipping for order ${orderId} with tracking number: ${trackingNumber}?`)) return;
    
    await fetch('/api/orders', {
      method: 'PATCH',
      body: JSON.stringify({ orderId, updates: { trackingNumber, status: 'Shipped' } }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchData();
  };

  const updateProduct = (index: number, field: string, value: any) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const addVariant = (productIndex: number) => {
    const newProducts = [...products];
    if (!newProducts[productIndex].variants) newProducts[productIndex].variants = [];
    newProducts[productIndex].variants.push({ name: 'New Specification', price: 0 });
    setProducts(newProducts);
  };

  const updateVariant = (pIdx: number, vIdx: number, field: string, value: any) => {
    const newProducts = [...products];
    newProducts[pIdx].variants[vIdx][field] = value;
    setProducts(newProducts);
  };

  const removeVariant = (pIdx: number, vIdx: number) => {
    const newProducts = [...products];
    newProducts[pIdx].variants.splice(vIdx, 1);
    setProducts(newProducts);
  };

  const addDetailImage = (productIndex: number) => {
    const newProducts = [...products];
    if (!newProducts[productIndex].detailImages) newProducts[productIndex].detailImages = [];
    newProducts[productIndex].detailImages.push('');
    setProducts(newProducts);
  };

  const addNewProduct = () => {
    const newProduct = {
      id: Date.now().toString(),
      name: 'New Product',
      series: 'Series Name',
      price: 0,
      image: 'https://images.pokemontcg.io/swsh7/215_hires.png',
      type: 'Standard',
      category: 'Standard',
      rarity: 'Common',
      stock: 0,
      description: 'New product description...',
      variants: [],
      detailImages: []
    };
    setProducts([...products, newProduct]);
    setExpandedRow(products.length); // Auto expand the new one
  };

  const removeProduct = (index: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      return data.url;
    } catch (e) {
      alert('Upload failed');
      return null;
    }
  };

  if (!isMounted || loading) return <div className="p-20 text-center font-bold text-gray-400">Loading Management System...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl text-center">
          <div className="w-20 h-20 bg-pokemon-red/10 text-pokemon-red rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Lock size={40} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Admin Access</h2>
          <p className="text-gray-400 font-medium mb-10">Enter your secret password to manage the store.</p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            if (passwordInput === settings.adminPassword) {
              setIsAuthorized(true);
            } else {
              alert("Incorrect password!");
            }
          }} className="space-y-6">
            <input 
              type="password" 
              placeholder="Enter Password..." 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 text-center font-black text-xl tracking-widest focus:ring-4 focus:ring-pokemon-red/5 outline-none"
              autoFocus
            />
            <button 
              type="submit"
              className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-gray-200"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Yang&apos;s Shop Admin</h1>
            <div className="flex flex-wrap gap-4 mt-6">
              <button 
                onClick={() => setActiveTab('products')}
                className={`px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'products' ? 'bg-gray-900 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}
              >
                <Package size={18} /> Products
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-gray-900 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}
              >
                <User size={18} /> Orders
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'settings' ? 'bg-gray-900 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}
              >
                <Settings size={18} /> Store Settings
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            {activeTab === 'products' && (
              <button onClick={addNewProduct} className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-2xl font-black text-lg shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-all">
                <Plus size={20} /> Add New Product
              </button>
            )}
            {(activeTab === 'products' || activeTab === 'settings') && (
              <button onClick={handleSaveProducts} disabled={saving} className="bg-pokemon-red text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-red-200 flex items-center gap-2 hover:bg-red-600 transition-all">
                <Save size={20} /> {saving ? 'Saving...' : 'Save All Changes'}
              </button>
            )}
          </div>
        </div>

        {activeTab === 'products' ? (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 flex items-center gap-10 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Truck size={24} /></div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Free Shipping Threshold</p>
                  <p className="text-xl font-black text-gray-900">${settings.freeShippingThreshold}</p>
                </div>
              </div>
              <div className="h-10 w-px bg-gray-100"></div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Std Shipping Fee</p>
                <p className="text-xl font-black text-gray-900">${settings.shippingFee}</p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Product Preview</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Price & Stock</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product, index) => (
                    <React.Fragment key={index}>
                      <tr className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-6">
                            <div className="relative group">
                              <img src={product.image} className="w-20 h-20 object-contain bg-gray-50 rounded-2xl border border-gray-100 shadow-inner" alt="" />
                              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-2xl text-white text-[10px] font-bold">CHANGE<input type="file" className="hidden" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if(f) { const u = await handleFileUpload(f); if(u) updateProduct(index, 'image', u); } }} /></label>
                            </div>
                             <div>
                               <input type="text" value={product.name} onChange={(e) => updateProduct(index, 'name', e.target.value)} className="font-black text-gray-900 bg-transparent border-none focus:ring-0 p-0 block text-lg mb-1" />
                                 <select 
                                 value={product.category} 
                                 onChange={(e) => updateProduct(index, 'category', e.target.value)}
                                 className="text-xs text-gray-400 font-bold uppercase tracking-wider bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                               >
                                 <option value="Standard">{settings.categoryStandard || 'Standard Break'}</option>
                                 <option value="Gameplay">{settings.categoryGameplay || 'Game Mode'}</option>
                               </select>

                             </div>

                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex gap-10">
                            <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase mb-2">Base Price</p>
                              <div className="flex items-center gap-1 font-black text-xl text-gray-900">
                                <span>$</span>
                                <input type="number" value={product.price} onChange={(e) => updateProduct(index, 'price', parseFloat(e.target.value))} className="bg-transparent border-none focus:ring-0 p-0 w-16" />
                              </div>
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase mb-2">Stock</p>
                              <input type="number" value={product.stock} onChange={(e) => updateProduct(index, 'stock', parseInt(e.target.value))} className="bg-transparent border-none focus:ring-0 p-0 w-16 font-black text-xl text-gray-900" />
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right space-x-2">
                          <button onClick={() => removeProduct(index)} className="p-3 hover:bg-red-50 rounded-xl transition-all text-red-400">
                            <Trash2 size={20} />
                          </button>
                          <button onClick={() => setExpandedRow(expandedRow === index ? null : index)} className="p-3 hover:bg-gray-100 rounded-xl transition-all text-gray-400">
                            {expandedRow === index ? <ChevronUp /> : <ChevronDown />}
                          </button>
                        </td>
                      </tr>
                      {expandedRow === index && (
                        <tr className="bg-gray-50/50">
                          <td colSpan={3} className="px-10 py-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div className="space-y-6">
                                <div className="flex items-center gap-2 text-gray-900"><AlignLeft size={18} className="text-pokemon-blue"/><h4 className="font-black uppercase tracking-widest text-sm">Description</h4></div>
                                <textarea value={product.description} onChange={(e) => updateProduct(index, 'description', e.target.value)} className="w-full bg-white border-none rounded-2xl p-4 text-sm font-medium h-32 focus:ring-4 focus:ring-pokemon-blue/5 shadow-sm" />
                                
                                <div className="flex items-center gap-2 text-gray-900"><List size={18} className="text-pokemon-blue"/><h4 className="font-black uppercase tracking-widest text-sm">Variants / Specifications</h4></div>
                                <div className="space-y-3">
                                  {product.variants?.map((v: any, vIdx: number) => (
                                    <div key={vIdx} className="flex gap-3 items-center bg-white p-3 rounded-xl shadow-sm">
                                      <input type="text" value={v.name} onChange={(e) => updateVariant(index, vIdx, 'name', e.target.value)} className="flex-grow bg-transparent border-none text-sm font-bold focus:ring-0" />
                                      <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg">
                                        <span className="text-xs font-bold text-gray-400">$</span>
                                        <input type="number" value={v.price} onChange={(e) => updateVariant(index, vIdx, 'price', parseFloat(e.target.value))} className="w-16 bg-transparent border-none text-sm font-black focus:ring-0" />
                                      </div>
                                      <button onClick={() => removeVariant(index, vIdx)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                    </div>
                                  ))}
                                  <button onClick={() => addVariant(index)} className="w-full border-2 border-dashed border-gray-200 py-3 rounded-xl text-xs font-black text-gray-400 hover:border-pokemon-blue hover:text-pokemon-blue transition-all uppercase">+ Add Variant</button>
                                </div>
                              </div>
                              <div className="space-y-6">
                                <div className="flex items-center gap-2 text-gray-900"><ImageIcon size={18} className="text-pokemon-blue"/><h4 className="font-black uppercase tracking-widest text-sm">Gallery Images</h4></div>
                                <div className="grid grid-cols-3 gap-4">
                                  {product.detailImages?.map((img: string, iIdx: number) => (
                                    <div key={iIdx} className="relative aspect-square group">
                                      <img src={img} className="w-full h-full object-cover rounded-2xl border border-gray-100" alt="" />
                                      <button onClick={() => { const p = [...products]; p[index].detailImages.splice(iIdx, 1); setProducts(p); }} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={12} /></button>
                                    </div>
                                  ))}
                                  <label className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-pokemon-blue hover:text-pokemon-blue cursor-pointer"><Plus size={20} /><span className="text-[8px] font-black uppercase">Upload</span><input type="file" className="hidden" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if(f) { const u = await handleFileUpload(f); if(u) { const p = [...products]; p[index].detailImages = [...(p[index].detailImages || []), u]; setProducts(p); } } }} /></label>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'orders' ? (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Search size={18} className="text-gray-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Search & Filter Orders</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Search by Order ID, Name, Email or Tracking #"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-4 focus:ring-pokemon-blue/5 outline-none"
                />
                <div className="relative group flex items-center bg-gray-50 rounded-2xl">
                  <div className="pl-6 text-gray-400 pointer-events-none">
                    <Clock size={18} />
                  </div>
                  <input 
                    type="date" 
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    onClick={(e) => {
                      try { (e.target as any).showPicker(); } catch (err) {}
                    }}
                    className="w-full bg-transparent border-none rounded-2xl px-4 py-4 font-bold focus:ring-0 outline-none cursor-pointer"
                  />
                  {dateFilter && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDateFilter(''); }}
                      className="pr-6 text-[10px] font-black uppercase text-gray-400 hover:text-pokemon-red transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Active Orders</p>
                <p className="text-3xl font-black text-gray-900">{orders.filter(o => o && o.status !== 'Delivered').length}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Pending Shipment</p>
                <p className="text-3xl font-black text-pokemon-blue">{orders.filter(o => o && o.status === 'Pending').length}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Currently on Hold</p>
                <p className="text-3xl font-black text-orange-500">{orders.filter(o => o && o.status === 'Hold').length}</p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Order & Customer</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Total Paid</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"><User size={20}/></div>
                            <div>
                              <p className="font-black text-gray-900">{order.customer?.name}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase">{order.id} • {order.date}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 font-black text-gray-900">${order.amount?.toFixed(2)}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'Pending' ? 'bg-blue-50 text-blue-600' : order.status === 'Hold' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} className="p-3 hover:bg-gray-100 rounded-xl transition-all text-gray-400">
                            {expandedOrder === order.id ? <ChevronUp /> : <ChevronDown />}
                          </button>
                        </td>
                      </tr>
                      {expandedOrder === order.id && (
                        <tr className="bg-gray-50/50">
                          <td colSpan={4} className="px-10 py-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div className="space-y-6">
                                <div className="flex items-center gap-2 text-gray-900"><Truck size={18} className="text-pokemon-blue"/><h4 className="font-black uppercase tracking-widest text-sm">Shipping Info</h4></div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Delivery Address</p>
                                  <p className="font-medium text-gray-900 leading-relaxed mb-6">{order.customer?.address}</p>
                                  
                                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Tracking Number</p>
                                  <div className="flex gap-2">
                                    <input 
                                      type="text" 
                                      id={`tracking-${order.id}`}
                                      defaultValue={order.trackingNumber || ''} 
                                      placeholder="Paste tracking number..."
                                      className="flex-grow bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-pokemon-blue/5 outline-none"
                                    />
                                    <button 
                                      onClick={() => {
                                        const input = document.getElementById(`tracking-${order.id}`) as HTMLInputElement;
                                        updateOrderTracking(order.id, input.value);
                                      }}
                                      className="bg-gray-900 text-white px-4 rounded-xl hover:bg-black transition-all"
                                    >
                                      <CheckCircle2 size={18}/>
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-6">
                                <div className="flex items-center gap-2 text-gray-900"><Package size={18} className="text-pokemon-blue"/><h4 className="font-black uppercase tracking-widest text-sm">Order Items</h4></div>
                                <div className="space-y-3">
                                  {order.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                      <div className="flex items-center gap-4">
                                        <img src={item.image} className="w-12 h-12 object-contain bg-gray-50 rounded-xl" alt=""/>
                                        <div>
                                          <p className="font-bold text-gray-900 text-sm leading-tight">{item.name}</p>
                                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.variantName || 'Standard'}</p>
                                        </div>
                                      </div>
                                      <p className="font-black text-gray-900">${item.price}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-bold">No orders received yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-gray-900">
                    <div className="p-2 bg-pokemon-red/10 text-pokemon-red rounded-xl"><Lock size={20} /></div>
                    <h3 className="font-black uppercase tracking-widest text-sm">Security & Login</h3>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Admin Panel Password</label>
                    <input 
                      type="text" 
                      value={settings.adminPassword} 
                      onChange={(e) => setSettings({...settings, adminPassword: e.target.value})} 
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-lg font-black focus:ring-4 focus:ring-pokemon-red/5 outline-none"
                    />
                  </div>
                </div>
                <div className="h-px bg-gray-50 w-full"></div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-gray-900">
                    <div className="p-2 bg-pokemon-blue/10 text-pokemon-blue rounded-xl"><Truck size={20} /></div>
                    <h3 className="font-black uppercase tracking-widest text-sm">Shipping Policy</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Free Shipping ($)</label>
                      <input type="number" value={settings.freeShippingThreshold} onChange={(e) => setSettings({...settings, freeShippingThreshold: parseFloat(e.target.value)})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-black focus:ring-4 focus:ring-pokemon-blue/5 outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Std Fee ($)</label>
                      <input type="number" value={settings.shippingFee} onChange={(e) => setSettings({...settings, shippingFee: parseFloat(e.target.value)})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-black focus:ring-4 focus:ring-pokemon-blue/5 outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-8">
                <div className="flex items-center gap-3 text-gray-900">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><ImageIcon size={20} /></div>
                  <h3 className="font-black uppercase tracking-widest text-sm">Homepage Design</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Hero Main Image</label>
                    <div className="flex items-center gap-4">
                      <img src={settings.heroImage} className="w-20 h-20 object-contain bg-gray-50 rounded-2xl border border-gray-100 p-2" alt="" />
                      <label className="flex-grow bg-gray-50 text-gray-400 py-3 rounded-xl border-2 border-dashed border-gray-100 hover:border-pokemon-blue hover:text-pokemon-blue flex flex-col items-center justify-center cursor-pointer transition-all">
                        <Plus size={16} />
                        <span className="text-[10px] font-black uppercase">Replace Image</span>
                        <input type="file" className="hidden" accept="image/*" onChange={async (e) => { 
                          const f = e.target.files?.[0]; 
                          if(f) { 
                            const u = await handleFileUpload(f); 
                            if(u) setSettings({...settings, heroImage: u}); 
                          } 
                        }} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Hero Title</label>
                    <input type="text" value={settings.heroTitle} onChange={(e) => setSettings({...settings, heroTitle: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-orange-50 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Hero Subtitle</label>
                    <textarea value={settings.heroSubtitle} onChange={(e) => setSettings({...settings, heroSubtitle: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-medium text-sm h-24 focus:ring-4 focus:ring-orange-50 outline-none" />
                  </div>
                </div>

                <div className="h-px bg-gray-50 w-full"></div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-gray-900">
                    <div className="p-2 bg-green-50 text-green-600 rounded-xl"><UserCircle size={20} /></div>
                    <h3 className="font-black uppercase tracking-widest text-sm">Contact Information</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">WhatsApp Number (with +)</label>
                      <input 
                        type="text" 
                        value={settings.contactWhatsApp} 
                        onChange={(e) => setSettings({...settings, contactWhatsApp: e.target.value})} 
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-green-50 outline-none"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Customer Service Email</label>
                      <input 
                        type="email" 
                        value={settings.contactEmail} 
                        onChange={(e) => setSettings({...settings, contactEmail: e.target.value})} 
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-green-50 outline-none"
                        placeholder="support@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">TikTok Profile URL</label>
                      <input 
                        type="text" 
                        value={settings.contactTikTok} 
                        onChange={(e) => setSettings({...settings, contactTikTok: e.target.value})} 
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-green-50 outline-none"
                        placeholder="https://www.tiktok.com/@youraccount"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">TikTok LIVE Link</label>
                      <input 
                        type="text" 
                        value={settings.liveLink} 
                        onChange={(e) => setSettings({...settings, liveLink: e.target.value})} 
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-pokemon-red/10 outline-none"
                        placeholder="https://www.tiktok.com/@youraccount/live"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Instagram Profile URL</label>
                      <input 
                        type="text" 
                        value={settings.contactInstagram} 
                        onChange={(e) => setSettings({...settings, contactInstagram: e.target.value})} 
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-green-50 outline-none"
                        placeholder="https://www.instagram.com/youraccount"
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-50 w-full"></div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-gray-900">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><List size={20} /></div>
                    <h3 className="font-black uppercase tracking-widest text-sm">Category Labels</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Standard Category Name</label>
                      <input 
                        type="text" 
                        value={settings.categoryStandard} 
                        onChange={(e) => setSettings({...settings, categoryStandard: e.target.value})} 
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-purple-50 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Gameplay Category Name</label>
                      <input 
                        type="text" 
                        value={settings.categoryGameplay} 
                        onChange={(e) => setSettings({...settings, categoryGameplay: e.target.value})} 
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-purple-50 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
