'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, User, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';

export default function Header() {
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [whatsapp, setWhatsapp] = useState('');
  const [liveLink, setLiveLink] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.settings?.contactWhatsApp) setWhatsapp(data.settings.contactWhatsApp);
        if (data.settings?.liveLink) setLiveLink(data.settings.liveLink);
      });
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile Menu */}
        <button className="lg:hidden p-2 text-gray-600">
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-pokemon-red rounded-full border-2 border-black flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full border border-black shadow-inner"></div>
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
            YANG&apos;S <span className="text-pokemon-red">CARD SHOP</span>
          </span>
        </Link>

        {/* Live Indicator - TikTok Style */}
        <a 
          href={liveLink || "https://www.tiktok.com"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gray-900 text-white px-3 py-1.5 rounded-full hover:bg-black transition-all group"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-pokemon-yellow">Live Now</span>
        </a>

        {/* Contact WhatsApp - Desktop */}
        {whatsapp && (
          <a 
            href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors"
          >
            <MessageCircle size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Contact Support</span>
          </a>
        )}

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8 relative">
          <input
            type="text"
            placeholder="Search rare cards..."
            className="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-pokemon-blue/20 outline-none transition-all"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors lg:hidden">
            <Search size={22} />
          </button>
          <Link href="/cart" className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-pokemon-red text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/profile" className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <User size={22} />
          </Link>
        </div>
      </div>
    </header>
  );
}
