import React, { useState } from 'react';
import { ShoppingCart, Search, Menu, Star, MapPin, X, ShoppingBag } from 'lucide-react';
import { Product, CartItem, Category } from './types';
import { ProductCard } from './components/ProductCard';
import { ChatWidget } from './components/ChatWidget';

// Mock Data for Mongolian Products
const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Монгол загварын хантааз',
    price: 125000,
    category: 'Хувцас',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
    description: 'Үндэсний хэв маягийг шингээсэн, дулаахан, загварлаг хантааз.'
  },
  {
    id: '2',
    name: 'Цэвэр ноолууран ороолт',
    price: 85000,
    category: 'Хувцас',
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=800',
    description: '100% ямааны ноолуураар хийсэн, зөөлөн тансаг мэдрэмж.'
  },
  {
    id: '3',
    name: 'Арьсан түрийвч (Handmade)',
    price: 55000,
    category: 'Хувцас',
    image: 'https://images.unsplash.com/photo-1627123424574-181ce5171c98?auto=format&fit=crop&q=80&w=800',
    description: 'Монгол үхрийн арьсаар гараар оёж хийсэн эдэлгээ сайтай түрийвч.'
  },
  {
    id: '4',
    name: 'Ухаалаг будаа агшаагч',
    price: 145000,
    category: 'Электроник',
    image: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&q=80&w=800',
    description: 'Олон үйлдэлтэй, цаг хэмнэх орчин үеийн гэр ахуйн хэрэгсэл.'
  },
  {
    id: '5',
    name: 'Ааруул, ээзгийний багц',
    price: 25000,
    category: 'Хүнс',
    image: 'https://images.unsplash.com/photo-1626139576127-4522902b7407?auto=format&fit=crop&q=80&w=800',
    description: 'Архангай аймгийн цэвэр экологийн цагаан идээний дээж.'
  },
  {
    id: '6',
    name: 'Эсгий таавчиг',
    price: 35000,
    category: 'Хувцас',
    image: 'https://plus.unsplash.com/premium_photo-1675276508359-5759e6659c03?auto=format&fit=crop&q=80&w=800',
    description: 'Хонины ноосон эсгийгээр хийсэн, хөлд эвтэйхэн дулаахан таавчиг.'
  },
  {
    id: '7',
    name: 'Гэр бүлийн цайны иж бүрдэл',
    price: 68000,
    category: 'Гэр ахуй',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800',
    description: 'Уламжлалт хээ угалзтай шаазан аяга, гүцний ком.'
  },
  {
    id: '8',
    name: 'Борцтой шөл (Бэлэн хоол)',
    price: 8500,
    category: 'Хүнс',
    image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?auto=format&fit=crop&q=80&w=800',
    description: 'Аялал зугаалгаар авч явахад тохиромжтой хатаасан борцтой шөл.'
  }
];

const CATEGORIES: Category[] = ['All', 'Хувцас', 'Гэр ахуй', 'Хүнс', 'Электроник'];

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Visual feedback could be added here
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-white p-1.5 rounded-lg">
                <Star size={20} fill="currentColor" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">Монгол<span className="text-primary">Шоп</span></span>
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Бараа хайх..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-full leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                className="relative p-2 text-slate-600 hover:text-primary transition-colors"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button className="md:hidden p-2 text-slate-600">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3">
          <input
            type="text"
            placeholder="Бараа хайх..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
          />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left max-w-lg">
            <div className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs font-medium text-emerald-300 mb-4 backdrop-blur-sm">
              <MapPin size={12} /> Улаанбаатар хот дотор хүргэлт үнэгүй
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Үндэсний үйлдвэрлэл <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Шилдэг чанар</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              Та гэрээсээ гаралгүй хүссэн бараагаа захиалж, 24 цагийн дотор хүргүүлэн аваарай.
            </p>
            <button className="bg-primary hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95">
              Дэлгүүр хэсэх
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'All' ? 'Бүгд' : cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">Хайлтад тохирох бараа олдсонгүй.</p>
          </div>
        )}
      </main>

      {/* Shopping Cart Sidebar / Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-xl flex flex-col h-full animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Таны сагс ({cartItemCount})</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag size={64} className="text-slate-200 mb-4" />
                    <p className="text-slate-500">Сагс хоосон байна.</p>
                  </div>
                ) : (
                  <ul className="space-y-6">
                    {cart.map((item) => (
                      <li key={item.id} className="flex py-2 animate-in fade-in duration-300">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-slate-200">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-slate-900">
                              <h3 className="line-clamp-1">{item.name}</h3>
                              <p className="ml-4">{item.price.toLocaleString()}₮</p>
                            </div>
                            <p className="mt-1 text-sm text-slate-500">{item.category}</p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <p className="text-slate-500">Тоо: {item.quantity}</p>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="font-medium text-red-600 hover:text-red-500"
                            >
                              Устгах
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t border-slate-100 px-6 py-6 bg-slate-50">
                <div className="flex justify-between text-base font-medium text-slate-900 mb-4">
                  <p>Нийт дүн</p>
                  <p>{cartTotal.toLocaleString()}₮</p>
                </div>
                <button 
                  disabled={cart.length === 0}
                  className="w-full bg-primary hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                  onClick={() => alert('Захиалга амжилттай хийгдлээ!')}
                >
                  Захиалах
                </button>
                <div className="mt-4 text-center text-xs text-slate-500">
                  <p>Хүргэлт 24-48 цагийн дотор хийгдэнэ.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Widget */}
      <ChatWidget />
      
    </div>
  );
};

export default App;