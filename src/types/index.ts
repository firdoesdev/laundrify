export type OrderStatus = 'DITERIMA' | 'DICUCI' | 'SIAP_DIAAMBIL' | 'SELESAI' | 'DIBATALKAN';
export type PaymentStatus = 'PENDING' | 'PAID' | 'CANCELLED';
export type PricingModel = 'RUPIAH_PER_KG' | 'RUPIAH_PER_ITEM';

export interface ServiceType {
  id: string;
  name: string;
  pricingModel: PricingModel;
  price: number;
  estimatedDuration: number;
}

export interface Order {
  id: string;
  customerId: string;
  serviceTypeId: string;
  items?: string;
  weight?: number;
  quantity?: number;
  perfume?: string;
  orderDate: string;
  dueDate: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  receiptNumber?: string;
  createdAt: string;
  updatedAt: string;
  // Optionally, you can add these if you join with relations:
  customer?: Customer;
  serviceType?: ServiceType;
}

export interface Customer {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  orders?: Order[];
}

export interface Report {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}
