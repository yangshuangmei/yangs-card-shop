'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingContact() {
  const [settings, setSettings] = useState({
    contactWhatsApp: ''
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.settings) setSettings(data.settings);
      });

    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!settings.contactWhatsApp || !visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[90] animate-in slide-in-from-bottom-10 duration-500">
      <a 
        href={`https://wa.me/${settings.contactWhatsApp.replace(/\D/g, '')}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-green-500 text-white pl-4 pr-6 py-3 rounded-full shadow-2xl shadow-green-200 hover:bg-green-600 hover:scale-105 transition-all group"
      >
        <div className="relative">
          <MessageCircle size={24} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-green-500 rounded-full animate-pulse"></span>
        </div>
        <div className="flex flex-col -space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Live Help</span>
          <span className="font-bold text-sm">Chat with Us</span>
        </div>
      </a>
      <button 
        onClick={() => setVisible(false)}
        className="absolute -top-2 -left-2 bg-white text-gray-400 p-1 rounded-full shadow-md hover:text-gray-900 transition-all border border-gray-100"
      >
        <X size={12} />
      </button>
    </div>
  );
}
