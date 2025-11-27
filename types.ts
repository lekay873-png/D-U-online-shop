export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  image?: string; // Base64 string
  timestamp: number;
  isError?: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type Category = 'All' | 'Хувцас' | 'Гэр ахуй' | 'Хүнс' | 'Электроник';
