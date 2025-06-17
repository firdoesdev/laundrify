
export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
export type PricingModel = 'per_kg' | 'per_item';

export interface ServiceType {
  id: string;
  name: string;
  pricingModel: PricingModel;
  price: number; // Price per kg if per_kg, price per item if per_item
}

export interface Order {
  id: string;
  customerName: string;
  customerId: string;
  serviceType: string; // Name of the service type
  status: OrderStatus;
  orderDate: string;
  dueDate?: string;
  totalAmount: number;
  items?: { name: string; quantity: number; price: number }[]; // Keep for potential future use, but not primary for this change
  weightInKg?: number; // Used if serviceType.pricingModel is 'per_kg'
  quantity?: number; // Used if serviceType.pricingModel is 'per_item'
  perfume?: string; // Used if serviceType.pricingModel is 'per_kg'
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
