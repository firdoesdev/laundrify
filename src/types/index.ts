
export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerId: string; // Can be manual entry for now
  serviceType: string; // e.g., "Regular Wash", "Express Wash"
  status: OrderStatus;
  orderDate: string; // Format: 'yyyy-MM-dd'
  dueDate?: string; // Optional, Format: 'yyyy-MM-dd'
  totalAmount: number; // Will be calculated: weightInKg * pricePerKg
  items?: { name: string; quantity: number; price: number }[]; // Optional for add-ons, not used in new form
  weightInKg?: number; // Weight in kilograms
  perfume?: string; // Selected perfume
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
  avatarUrl?: string; // Added from customer-table usage
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
  rating?: number; // Optional rating
}
