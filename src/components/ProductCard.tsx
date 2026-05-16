import React from 'react';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    series: string;
    price: number;
    image: string;
    type: string;
    rarity: string;
    variants?: { name: string; price: number }[];
  };
  onAdded?: (info: { name: string; variant: string; qty: number }) => void;
}

export default function ProductCard({ product }: ProductCardProps) {
  const getPriceDisplay = () => {
    if (!product.variants || product.variants.length === 0) {
      return `$${product.price.toFixed(2)}`;
    }

    const prices = product.variants.map(v => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return `$${minPrice.toFixed(2)}`;
    }

    return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
  };

  return (
    <Link href={`/product/${product.id}`} className="group bg-white rounded-2xl p-3 pokemon-card-shadow border border-gray-100 block">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-50 mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="bg-black/80 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
            {product.rarity}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1 px-1">
        <p className="text-xs text-gray-500 font-medium">{product.series}</p>
        <h3 className="font-bold text-gray-900 leading-tight group-hover:text-pokemon-blue transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-black text-gray-900">{getPriceDisplay()}</span>
          <div className="text-[10px] font-black text-pokemon-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">
            View Details
          </div>
        </div>

      </div>
    </Link>
  );
}
