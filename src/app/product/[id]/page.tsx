'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { products as localProducts } from '@/data/products';
import { useCartStore } from '@/lib/store';
import { 
  ChevronLeft, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RefreshCw,
  Star,
  Check,
  Package,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [products, setProducts] = useState(localProducts);
  const [showSuccess, setShowSuccess] = useState(false);
  const [addedInfo, setAddedInfo] = useState({ name: '', variant: '', qty: 0 });
  const product = products.find((p) => p.id === params.id);
  
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function syncData() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.products) setProducts(data.products);
      } catch (e) {}
    }
    syncData();
  }, []);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      }
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/" className="text-pokemon-blue hover:underline">Back to Shop</Link>
      </div>
    );
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: currentPrice,
        image: product.image,
        variantName: selectedVariant?.name
      });
    }
    
    setAddedInfo({
      name: product.name,
      variant: selectedVariant?.name || 'Standard',
      qty: quantity
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  const handleBuyItNow = () => {
    // Add to cart and jump to checkout immediately
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: currentPrice,
        image: product.image,
        variantName: selectedVariant?.name
      });
    }
    router.push('/cart');
  };

  const gallery = [product.image, ...(product.detailImages || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 py-6 md:py-12 w-full">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-8">
          <ChevronLeft size={16} />
          Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden p-8 flex items-center justify-center border border-gray-100 shadow-sm">
              <img 
                src={activeImage} 
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-2xl transition-all duration-500"
              />
            </div>
            
            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {gallery.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all p-1 bg-gray-50 ${
                      activeImage === img ? 'border-pokemon-blue shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-contain" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="text-pokemon-red font-bold text-sm uppercase tracking-widest">{product.series}</span>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-2 mt-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <span className="text-sm text-gray-400 font-bold ml-2">Verified Collection</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-gray-900">${currentPrice.toFixed(2)}</span>
              </div>
              
              <div className="mt-4 inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-[11px] font-bold border border-orange-100">
                <ShieldCheck size={16} />
                <span>Notice: Placing an order constitutes agreement that sealed products are non-refundable once opened.</span>
              </div>
            </div>

            {product.variants && product.variants.length > 0 && (
              <div className="mb-10">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4">Select Specification</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.variants.map((v: any, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedVariant(v)}
                      className={`relative flex flex-col p-5 rounded-3xl border-2 text-left transition-all ${
                        selectedVariant?.name === v.name 
                          ? 'border-pokemon-blue bg-blue-50/30 shadow-sm' 
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <span className="font-bold text-gray-900 text-lg">{v.name}</span>
                      <span className="text-sm font-bold text-pokemon-blue mt-1">${v.price.toFixed(2)}</span>
                      {selectedVariant?.name === v.name && (
                        <div className="absolute top-4 right-4 text-pokemon-blue">
                          <Check size={20} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6 mb-12">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-100 rounded-2xl overflow-hidden bg-white">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 py-3 hover:bg-gray-50 text-xl font-bold transition-colors">-</button>
                    <span className="px-5 py-3 font-black w-14 text-center text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-5 py-3 hover:bg-gray-50 text-xl font-bold transition-colors">+</button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-gray-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all flex items-center justify-center gap-3 shadow-lg shadow-gray-200"
                >
                  <ShoppingCart size={22} /> Add to Cart
                </button>
                <button 
                  onClick={handleBuyItNow}
                  className="flex-1 bg-pokemon-red text-white py-5 rounded-2xl font-black text-lg hover:bg-red-600 shadow-xl shadow-red-200 transition-all"
                >
                  Buy It Now
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gray-100 pt-10">
              <div className="flex flex-col items-center text-center gap-3 p-2">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-pokemon-blue shadow-sm"><ShieldCheck size={24} /></div>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">100% Authentic</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3 p-2">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-pokemon-blue shadow-sm"><Truck size={24} /></div>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Safe Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3 p-2">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-pokemon-blue shadow-sm"><RefreshCw size={24} /></div>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Long Description / Detail Content Section */}
        {product.longDescription && (
          <section className="mt-24 max-w-4xl mx-auto border-t border-gray-100 pt-16 mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-pokemon-red rounded-full"></div>
              <h2 className="text-3xl font-black text-gray-900">Product Details</h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg">
                {product.longDescription}
              </p>
            </div>
          </section>
        )}
      </main>
      <Footer />

      {/* Success Notification Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-300">
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
