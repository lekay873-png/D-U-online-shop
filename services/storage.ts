import { Product, User } from '../types';

// Initial Mock Data
const INITIAL_PRODUCTS: Product[] = [
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

const ADMIN_USER: User = {
  id: 'admin',
  name: 'Admin User',
  email: 'admin@shop.mn',
  role: 'admin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
};

const STORAGE_KEYS = {
  PRODUCTS: 'mongolshop_products',
  USER: 'mongolshop_user'
};

export const storageService = {
  // Products
  getProducts: (): Product[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(stored);
  },

  addProduct: (product: Product) => {
    const products = storageService.getProducts();
    const newProducts = [product, ...products];
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(newProducts));
    return newProducts;
  },

  deleteProduct: (id: string) => {
    const products = storageService.getProducts();
    const newProducts = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(newProducts));
    return newProducts;
  },

  // Auth (Simplified for Demo)
  login: (email: string): User => {
    // Mock login logic
    if (email === ADMIN_USER.email) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(ADMIN_USER));
      return ADMIN_USER;
    }
    
    const user: User = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email: email,
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  }
};
