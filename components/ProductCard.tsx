import React from 'react';
import { Product } from '../types';
import { ShoppingBag, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-slate-100 flex flex-col h-full group">
      <div className="relative pt-[100%] bg-slate-100 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-white p-2 rounded-full shadow-lg text-primary hover:bg-primary hover:text-white transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-slate-500 mb-1">{product.category}</div>
        <h3 className="font-semibold text-slate-800 text-lg mb-1 leading-tight line-clamp-2">{product.name}</h3>
        <p className="text-xs text-slate-400 mb-3 line-clamp-2 flex-1">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
          <span className="font-bold text-lg text-slate-900">
            {product.price.toLocaleString()}₮
          </span>
          <button 
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary transition-colors active:scale-95"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Сагслах</span>
          </button>
        </div>
      </div>
    </div>
  );
};