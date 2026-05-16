'use client';

import React, { useState, useEffect } from 'react';
import { Instagram, Twitter, Youtube, Mail, Phone, MessageCircle } from 'lucide-react';

export default function Footer() {
  const [settings, setSettings] = useState({
    contactWhatsApp: '',
    contactEmail: '',
    contactTikTok: '',
    contactInstagram: ''
  });

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.settings) setSettings(data.settings);
      });
  }, []);

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 px-4 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-pokemon-red rounded-full border border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full border border-black shadow-inner"></div>
            </div>
            <span className="font-bold text-lg tracking-tight">
              YANG&apos;S <span className="text-pokemon-red">CARD SHOP</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your premium destination for authentic Pokemon TCG collectibles. We source the rarest cards worldwide.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-pokemon-yellow transition-colors">Best Sellers</a></li>
            <li><a href="#" className="hover:text-pokemon-yellow transition-colors">New Arrivals</a></li>
            <li><a href="#" className="hover:text-pokemon-yellow transition-colors">Graded Cards</a></li>
            <li><a href="#" className="hover:text-pokemon-yellow transition-colors">Sealed Products</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-pokemon-yellow transition-colors">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-pokemon-yellow transition-colors">Returns & Refunds</a></li>
            <li><a href="#" className="hover:text-pokemon-yellow transition-colors">Authenticity Guarantee</a></li>
            <li><a href="#" className="hover:text-pokemon-yellow transition-colors">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-black uppercase tracking-widest text-xs mb-6 text-white/50">Contact Us</h4>
          <div className="space-y-4">
            {settings.contactWhatsApp && (
              <a 
                href={`https://wa.me/${settings.contactWhatsApp.replace(/\D/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/30">WhatsApp</p>
                  <p className="font-bold">{settings.contactWhatsApp}</p>
                </div>
              </a>
            )}
            {settings.contactEmail && (
              <a 
                href={`mailto:${settings.contactEmail}`} 
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-pokemon-blue group-hover:text-white transition-all">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/30">Email Support</p>
                  <p className="font-bold">{settings.contactEmail}</p>
                </div>
              </a>
            )}
            {settings.contactTikTok && (
              <a 
                href={settings.contactTikTok} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.31-.75.42-1.24 1.25-1.31 2.1-.05.9.35 1.83 1.05 2.42.7.6 1.67.8 2.58.59 1.07-.19 1.91-1.15 2-2.22.01-4.06-.01-8.13-.01-12.19z"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/30">TikTok</p>
                  <p className="font-bold text-sm truncate max-w-[150px]">Follow our Feed</p>
                </div>
              </a>
            )}
            {settings.contactInstagram && (
              <a 
                href={settings.contactInstagram} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-all">
                  <Instagram size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/30">Instagram</p>
                  <p className="font-bold text-sm truncate max-w-[150px]">Card Gallery</p>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-xs">© 2026 Yang&apos;s Card Shop. Not affiliated with Nintendo/The Pokémon Company.</p>
        <div className="flex gap-4">
          <Instagram size={18} className="text-gray-400 hover:text-white cursor-pointer" />
          <Twitter size={18} className="text-gray-400 hover:text-white cursor-pointer" />
          <Youtube size={18} className="text-gray-400 hover:text-white cursor-pointer" />
        </div>
      </div>
    </footer>
  );
}
