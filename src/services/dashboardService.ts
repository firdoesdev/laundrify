// (Removed duplicate fetchOrderTrends and fetchTopCustomers)
// Fetch recent orders for dashboard
export async function fetchRecentOrders() {
  const res = await fetch('/api/dashboard/recent-orders');
  if (!res.ok) throw new Error('Failed to fetch recent orders');
  return res.json();
}
import { Order, Customer } from '@/types';

export async function fetchDashboardStats() {
  // Example: fetch from API endpoint
  const res = await fetch('/api/dashboard');
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}

export async function fetchOrderTrends() {
  const res = await fetch('/api/dashboard/order-trends');
  if (!res.ok) throw new Error('Failed to fetch order trends');
  return res.json();
}

export async function fetchTopCustomers() {
  const res = await fetch('/api/dashboard/top-customers');
  if (!res.ok) throw new Error('Failed to fetch top customers');
  return res.json();
}
