import React, { useState } from 'react';
import { Product, Category } from '../types';
import { Plus, Trash2, Image as ImageIcon, Save, X } from 'lucide-react';
import { storageService } from '../services/storage';

interface AdminDashboardProps {
  products: Product[];
  onProductUpdate: () => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, onProductUpdate, onClose }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'Хувцас',
    description: '',
    image: ''
  });

  const categories: Category[] = ['Хувцас', 'Гэр ахуй', 'Хүнс', 'Электроник'];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category as string,
      image: newProduct.image || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=800',
      description: newProduct.description || 'Тайлбар байхгүй'
    };

    storageService.addProduct(product);
    onProductUpdate();
    setIsAdding(false);
    setNewProduct({ name: '', price: 0, category: 'Хувцас', description: '', image: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Та энэ барааг устгахдаа итгэлтэй байна уу?')) {
      storageService.deleteProduct(id);
      onProductUpdate();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Админ Удирдлага</h1>
            <p className="text-slate-500">Бараа нэмэх, хасах, засах хэсэг</p>
          </div>
          <button 
            onClick={onClose}
            className="flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
          >
            <X size={20} /> Гарах
          </button>
        </div>

        {/* Add Product Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Шинэ бараа нэмэх</h2>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className={`p-2 rounded-lg transition-colors ${isAdding ? 'bg-slate-100 text-slate-600' : 'bg-primary text-white'}`}
            >
              <Plus size={24} className={isAdding ? 'rotate-45 transition-transform' : 'transition-transform'} />
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Барааны нэр</label>
                  <input
                    required
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Жишээ: Ноолууран цамц"
                  />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Үнэ (₮)</label>
                  <input
                    required
                    type="number"
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ангилал</label>
                  <select
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Зургийн URL</label>
                  <div className="flex gap-2">
                    <input
                      value={newProduct.image}
                      onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder="https://..."
                    />
                  </div>
                  {newProduct.image && (
                    <div className="mt-2 h-32 w-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                      <img src={newProduct.image} alt="Preview" className="h-full w-full object-contain" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Тайлбар</label>
                  <textarea
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none h-24 resize-none"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30">
                    <Save size={18} /> Хадгалах
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Product List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Зураг</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Нэр</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Ангилал</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Үнэ</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover border border-slate-200" />
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                  <td className="px-6 py-4 text-slate-500">{product.category}</td>
                  <td className="px-6 py-4 text-slate-900">{product.price.toLocaleString()}₮</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                      title="Устгах"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
