export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  // Add other user fields as needed
}

export interface Product {
  id: string;
  description: string;
  price: number;
  type: "USED" | "NEW";
  stock: number;
  size: string;
  imageUrl: string;
  category?: string;
  createdAt: Date;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
}
