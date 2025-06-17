
import type { Order, Customer, Review, ServiceType } from '@/types';
import { format } from 'date-fns';

export const PERFUME_OPTIONS = ["Ocean Fresh", "Lavender Bliss", "Spring Dew", "Citrus Burst", "Unscented"];

export const sampleServiceTypes: ServiceType[] = [
  { id: 'ST001', name: 'Regular Kilogram', pricingModel: 'per_kg', price: 7000 },
  { id: 'ST002', name: 'Express Kilogram (6 Hours)', pricingModel: 'per_kg', price: 12000 },
  { id: 'ST003', name: 'Bed Cover Cleaning', pricingModel: 'per_item', price: 25000 },
  { id: 'ST004', name: 'Shoes Cleaning (Pair)', pricingModel: 'per_item', price: 50000 },
  { id: 'ST005', name: 'Ironing Only (per Kg)', pricingModel: 'per_kg', price: 5000 },
];

export const sampleOrders: Order[] = [
  {
    id: 'ORD001',
    customerName: 'Alice Wonderland',
    customerId: 'CUST001',
    serviceType: sampleServiceTypes[0].name, // Regular Kilogram
    status: 'Completed',
    orderDate: format(new Date(2023, 10, 15), 'yyyy-MM-dd'),
    dueDate: format(new Date(2023, 10, 17), 'yyyy-MM-dd'),
    weightInKg: 1.7,
    perfume: PERFUME_OPTIONS[0],
    totalAmount: 1.7 * 7000, // 11900
  },
  {
    id: 'ORD002',
    customerName: 'Bob The Builder',
    customerId: 'CUST002',
    serviceType: sampleServiceTypes[2].name, // Bed Cover Cleaning
    status: 'Processing',
    orderDate: format(new Date(2023, 11, 1), 'yyyy-MM-dd'),
    dueDate: format(new Date(2023, 11, 5), 'yyyy-MM-dd'),
    quantity: 2, // 2 Bed Covers
    totalAmount: 2 * 25000, // 50000
  },
  {
    id: 'ORD003',
    customerName: 'Charlie Brown',
    customerId: 'CUST003',
    serviceType: sampleServiceTypes[1].name, // Express Kilogram
    status: 'Pending',
    orderDate: format(new Date(), 'yyyy-MM-dd'),
    weightInKg: 2.05,
    perfume: PERFUME_OPTIONS[2],
    totalAmount: 2.05 * 12000, // 24600
  },
    {
    id: 'ORD004',
    customerName: 'Diana Prince',
    customerId: 'CUST004',
    serviceType: sampleServiceTypes[0].name, // Regular Kilogram
    status: 'Completed',
    orderDate: format(new Date(2023, 9, 20), 'yyyy-MM-dd'),
    weightInKg: 1.2,
    perfume: PERFUME_OPTIONS[0],
    totalAmount: 1.2 * 7000, // 8400
  },
  {
    id: 'ORD005',
    customerName: 'Edward Scissorhands',
    customerId: 'CUST005',
    serviceType: sampleServiceTypes[3].name, // Shoes Cleaning
    status: 'Cancelled',
    orderDate: format(new Date(2023, 11, 3), 'yyyy-MM-dd'),
    quantity: 1, // 1 pair of shoes
    totalAmount: 1 * 50000, // 50000
  },
];

export const sampleCustomers: Customer[] = [
  {
    id: 'CUST001',
    name: 'Alice Wonderland',
    phone: '555-0101',
    email: 'alice@example.com',
    address: '123 Fantasy Lane, Wonderland',
    joinDate: format(new Date(2022, 0, 10), 'yyyy-MM-dd'),
    totalOrders: 5,
    lastOrderDate: format(new Date(2023, 10, 15), 'yyyy-MM-dd'),
    avatarUrl: 'https://placehold.co/40x40.png',
  },
  {
    id: 'CUST002',
    name: 'Bob The Builder',
    phone: '555-0102',
    email: 'bob@example.com',
    address: '456 Construction Rd, Builderville',
    joinDate: format(new Date(2022, 3, 22), 'yyyy-MM-dd'),
    totalOrders: 12,
    lastOrderDate: format(new Date(2023, 11, 1), 'yyyy-MM-dd'),
    avatarUrl: 'https://placehold.co/40x40.png',
  },
  {
    id: 'CUST003',
    name: 'Charlie Brown',
    phone: '555-0103',
    email: 'charlie@example.com',
    address: '789 Comic Strip Ave, Toontown',
    joinDate: format(new Date(2023, 5, 1), 'yyyy-MM-dd'),
    totalOrders: 2,
    lastOrderDate: format(new Date(), 'yyyy-MM-dd'),
    avatarUrl: 'https://placehold.co/40x40.png',
  },
    {
    id: 'CUST004',
    name: 'Diana Prince',
    phone: '555-0104',
    email: 'diana@example.com',
    address: '789 Amazon Trail, Themyscira',
    joinDate: format(new Date(2021, 8, 15), 'yyyy-MM-dd'),
    totalOrders: 8,
    lastOrderDate: format(new Date(2023, 9, 20), 'yyyy-MM-dd'),
    avatarUrl: 'https://placehold.co/40x40.png',
  },
  {
    id: 'CUST005',
    name: 'Edward Scissorhands',
    phone: '555-0105',
    email: 'edward@example.com',
    address: '1 Artist Colony, Suburbia',
    joinDate: format(new Date(2023, 1, 5), 'yyyy-MM-dd'),
    totalOrders: 3,
    lastOrderDate: format(new Date(2023, 11, 3), 'yyyy-MM-dd'),
    avatarUrl: 'https://placehold.co/40x40.png',
  },
];

export const sampleReviews: Review[] = [
  {
    id: 'REV001',
    customerName: 'Alice Wonderland',
    reviewText: 'The service was fantastic! My clothes came back smelling fresh and perfectly folded. Highly recommend!',
    date: format(new Date(2023, 10, 18), 'yyyy-MM-dd'),
    rating: 5,
  },
  {
    id: 'REV002',
    customerName: 'Bob The Builder',
    reviewText: 'My suit was dry cleaned impeccably. The stain I thought was permanent is gone. A bit pricey, but worth it for special items.',
    date: format(new Date(2023, 11, 6), 'yyyy-MM-dd'),
    rating: 4,
  },
  {
    id: 'REV003',
    customerName: 'Anonymous User',
    reviewText: 'The turnaround time was longer than expected and one of my socks is missing. Not very happy with this experience.',
    date: format(new Date(2023, 11, 10), 'yyyy-MM-dd'),
    rating: 2,
  },
];
