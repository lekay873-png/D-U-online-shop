import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, Star, MapPin, X, ShoppingBag, User as UserIcon, LogOut, Settings, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { Product, CartItem, Category, User } from './types';
import { ProductCard } from './components/ProductCard';
import { ChatWidget } from './components/ChatWidget';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { PaymentModal } from './components/PaymentModal';
import { storageService } from './services/storage';

const CATEGORIES: Category[] = ['All', 'Хувцас', 'Гэр ахуй', 'Хүнс', 'Электроник'];

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Admin State
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Payment State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Load Initial Data
  useEffect(() => {
    setProducts(storageService.getProducts());
    const user = storageService.getCurrentUser();
    if (user) setCurrentUser(user);

    // Load cart from local storage
    const savedCart = localStorage.getItem('mongolshop_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save Cart on Change
  useEffect(() => {
    localStorage.setItem('mongolshop_cart', JSON.stringify(cart));
  }, [cart]);

  const refreshProducts = () => {
    setProducts(storageService.getProducts());
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    storageService.logout();
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    setIsAdminOpen(false);
  };

  const filteredProducts = products.filter(product => {
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
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setIsCartOpen(false);
  };

  const handleCheckout = () => {
    if (!currentUser) {
      alert("Та худалдан авалт хийхийн тулд эхлээд нэвтэрнэ үү.");
      setIsCartOpen(false);
      setIsAuthModalOpen(true);
      return;
    }
    setIsCartOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    clearCart();
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => {setIsAdminOpen(false); window.scrollTo(0,0)}}>
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
              
              {/* User Menu */}
              <div className="relative">
                {currentUser ? (
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <img 
                      src={currentUser.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full border border-slate-200 bg-slate-100" 
                    />
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center gap-2 text-slate-600 font-medium hover:text-primary transition-colors"
                  >
                    <UserIcon size={20} />
                    <span className="hidden sm:inline">Нэвтрэх</span>
                  </button>
                )}

                {/* Dropdown */}
                {isUserMenuOpen && currentUser && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 py-1 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-slate-50">
                      <p className="text-sm text-slate-900 font-semibold truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                    {currentUser.role === 'admin' && (
                      <button 
                        onClick={() => { setIsAdminOpen(true); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Settings size={16} /> Админ самбар
                      </button>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={16} /> Гарах
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={handleLogin} 
      />

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        totalAmount={cartTotal}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      {/* Admin Dashboard Overlay */}
      {isAdminOpen && currentUser?.role === 'admin' ? (
        <AdminDashboard 
          products={products} 
          onProductUpdate={refreshProducts} 
          onClose={() => setIsAdminOpen(false)} 
        />
      ) : (
        <>
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
                  Та гэрээсээ гаралгүй хүссэн бараагаа захиалж, 24 цагийн дотор хүргүүлэн авах боломжтой.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <button className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <ShoppingBag size={20} /> Худалдан авах
                  </button>
                  <button className="bg-white/10 text-white px-8 py-3 rounded-full font-bold hover:bg-white/20 transition-colors backdrop-blur-sm">
                    Дэлгэрэнгүй
                  </button>
                </div>
              </div>
              <div className="hidden md:block">
                 {/* Decorative Hero Image could go here */}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Filter Tabs */}
            <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors border ${
                    selectedCategory === category
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-slate-500">Бараа олдсонгүй.</p>
              </div>
            )}
          </main>
        </>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ShoppingBag size={20} /> Таны сагс
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-500 hover:text-slate-700 p-1">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <ShoppingCart size={48} className="mb-4 opacity-50" />
                  <p>Сагс хоосон байна</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 text-primary font-medium hover:underline"
                  >
                    Худалдан авалт хийх
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-white" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-800 line-clamp-1">{item.name}</h4>
                        <p className="text-primary font-bold">{item.price.toLocaleString()}₮</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-slate-500 hover:text-slate-800 disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-slate-500 hover:text-slate-800"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-600">Нийт дүн</span>
                  <span className="text-2xl font-bold text-slate-900">{cartTotal.toLocaleString()}₮</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-primary transition-colors flex items-center justify-center gap-2"
                >
                  Захиалах <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <ChatWidget />
    </div>
  );
};

export default App;