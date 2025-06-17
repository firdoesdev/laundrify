
export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerId: string; 
  serviceType: string; 
  status: OrderStatus;
  orderDate: string; 
  dueDate?: string; 
  totalAmount: number; 
  items?: { name: string; quantity: number; price: number }[]; 
  weightInKg?: number; 
  perfume?: string; 
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  joinDate: string;
  totalOrders: number;
  lastOrderDate?: string;
  avatarUrl?: string; 
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  avatarUrl?: string;
}

export interface Metric {
  title: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  changeType?: 'positive' | 'negative';
}

export interface Review {
  id: string;
  customerName: string;
  reviewText: string;
  date: string;
  rating?: number; 
}

export interface ServiceType {
  id: string;
  name: string;
}
