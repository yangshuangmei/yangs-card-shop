'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { 
  Sparkles,
  Package,
  Flame,
  Zap,
  Check,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [addedInfo, setAddedInfo] = useState({ name: '', variant: '', qty: 0 });
  const [settings, setSettings] = useState({
    heroImage: "https://images.pokemontcg.io/swsh7/215_hires.png",
    heroTitle: "Your Premium TCG Destination",
    heroSubtitle: "Source the rarest cards and sealed products. Join our community for weekly drops and live breaks.",
    contactWhatsApp: "",
    contactEmail: "",
    contactTikTok: "",
    contactInstagram: "",
    categoryStandard: 'Standard Breaks',
    categoryGameplay: 'Game Modes',
    categorySpecial: 'Special Drops'
  });

  const categories = useMemo(() => [
    { id: 'all', name: 'Trending', icon: Sparkles },
    { id: 'Standard', name: settings.categoryStandard || 'Standard Breaks', icon: Package },
    { id: 'Gameplay', name: settings.categoryGameplay || 'Game Modes', icon: Flame },
  ], [settings]);


  React.useEffect(() => {
    fetch(`/api/products?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data.settings) setSettings(data.settings);
        if (data.products) setDbProducts(data.products);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return dbProducts;
    return dbProducts.filter(p => 
      p.category === selectedCategory || p.type === selectedCategory
    );
  }, [selectedCategory, dbProducts]);

  const handleProductAdded = (info: { name: string; variant: string; qty: number }) => {
    setAddedInfo(info);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 bg-pokemon-red/10 text-pokemon-red px-3 py-1 rounded-full text-sm font-bold mb-6">
                <Sparkles size={16} />
                <span>Live Pack Openings on TikTok</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
                {(settings.heroTitle || "").split(' ').map((word, i, arr) => (
                  <span key={i} className={i >= arr.length - 2 ? "text-pokemon-blue" : ""}>
                    {word}{' '}
                  </span>
                ))}
              </h1>
              <p className="text-gray-600 text-lg mb-8 max-w-xl">
                {settings.heroSubtitle}
              </p>
              <div className="flex flex-col sm:row items-center gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => {
                    setSelectedCategory('all');
                    document.getElementById('shop-now')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto bg-pokemon-red text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                >
                  Shop Now <ArrowRight size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-pokemon-blue/10 rounded-full blur-3xl -z-10"></div>
                <img 
                  src={settings.heroImage} 
                  alt="Hero Image"
                  className="w-full h-auto drop-shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-white border-y border-gray-100 py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 text-center lg:text-left">
              Browse Categories
            </h3>
            <div className="flex items-center gap-4 lg:gap-8 overflow-x-auto pb-4 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-center gap-3 group min-w-[80px] transition-all ${
                    selectedCategory === cat.id ? 'scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-all ${
                    selectedCategory === cat.id 
                      ? 'bg-pokemon-red text-white shadow-red-200 shadow-lg' 
                      : 'bg-gray-50 text-gray-600 group-hover:bg-gray-100'
                  }`}>
                    <cat.icon size={24} />
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${
                    selectedCategory === cat.id ? 'text-pokemon-red' : 'text-gray-500'
                  }`}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works / Gameplay Guide */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 text-white flex flex-col items-center text-center overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pokemon-red/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            
            <div className="max-w-2xl space-y-6 relative z-10">
              <div className="inline-block bg-white/10 px-4 py-1.5 rounded-full text-pokemon-yellow text-xs font-black uppercase tracking-widest">
                New to Live Breaks?
              </div>
              <h2 className="text-3xl md:text-5xl font-black leading-tight">How to Play & Get <br />Your Hits <span className="text-pokemon-red">Live</span></h2>
              <div className="space-y-4 pt-4 text-left inline-block">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-pokemon-red flex items-center justify-center font-black flex-shrink-0">1</div>
                  <p className="text-gray-300 font-medium">Choose your favorite <span className="text-white font-bold">{settings.categoryStandard || 'Standard Break'}</span> or <span className="text-white font-bold">{settings.categoryGameplay || 'Game Mode'}</span> below.</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-pokemon-red flex items-center justify-center font-black flex-shrink-0">2</div>
                  <p className="text-gray-300 font-medium">Join our <span className="text-pokemon-yellow font-bold">TikTok Live Stream</span> after checkout.</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-pokemon-red flex items-center justify-center font-black flex-shrink-0">3</div>
                  <p className="text-gray-300 font-medium">Watch as we open your packs <span className="text-white font-bold underline italic">LIVE</span> and ship your hits!</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section id="shop-now" className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900">
                {categories.find(c => c.id === selectedCategory)?.name || 'Trending'}
              </h2>
              <p className="text-gray-500">Showing {filteredProducts.length} authentic products.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 font-medium">Sort by:</span>
              <select className="bg-transparent border-none text-sm font-bold text-gray-900 focus:ring-0 cursor-pointer">
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <Package size={48} className="mx-auto text-gray-200 mb-4" />
              <h3 className="text-xl font-bold text-gray-400">No items found in this category</h3>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Success Notification Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSuccess(false)}></div>
          <div className="relative bg-white rounded-[2.5rem] p-8 shadow-2xl max-w-sm w-full text-center scale-up-center">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Check size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Added to Cart!</h3>
            <div className="bg-gray-50 rounded-2xl p-4 mb-8">
              <p className="font-bold text-gray-900">{addedInfo.name}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="bg-pokemon-blue/10 text-pokemon-blue px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">{addedInfo.variant}</span>
                <span className="text-gray-400 font-bold text-xs">x {addedInfo.qty}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Link 
                href="/cart" 
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-black text-lg hover:bg-black transition-all"
              >
                View Cart & Checkout
              </Link>
              <button 
                onClick={() => setShowSuccess(false)}
                className="w-full text-gray-400 font-bold py-2 hover:text-gray-900 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
