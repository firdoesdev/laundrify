import { PrismaClient, PricingModel, OrderStatus, PaymentStatus } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Create Service Types
  const cuciKering = await prisma.serviceType.create({
    data: {
      name: 'Cuci Kering',
      pricingModel: PricingModel.RUPIAH_PER_KG,
      price: 8000,
      estimatedDuration: 24,
    },
  });
  const setrikaSaja = await prisma.serviceType.create({
    data: {
      name: 'Setrika Saja',
      pricingModel: PricingModel.RUPIAH_PER_ITEM,
      price: 2000,
      estimatedDuration: 12,
    },
  });

  // Create Customers
  const john = await prisma.customer.create({
    data: {
      fullName: 'John Doe',
      phoneNumber: '081234567890',
      email: 'john@example.com',
      address: 'Jl. Merdeka No. 1',
    },
  });
  const jane = await prisma.customer.create({
    data: {
      fullName: 'Jane Smith',
      phoneNumber: '081298765432',
      email: 'jane@example.com',
      address: 'Jl. Sudirman No. 2',
    },
  });

  // Create Orders
  await prisma.order.create({
    data: {
      customerId: john.id,
      serviceTypeId: cuciKering.id,
      items: '5kg pakaian campur',
      weight: 5,
      orderDate: new Date(),
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      paymentStatus: PaymentStatus.PAID,
      status: OrderStatus.DICUCI,
      receiptNumber: 'INV-001',
    },
  });
  await prisma.order.create({
    data: {
      customerId: jane.id,
      serviceTypeId: setrikaSaja.id,
      items: '10 baju',
      quantity: 10,
      orderDate: new Date(),
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      paymentStatus: PaymentStatus.PENDING,
      status: OrderStatus.DITERIMA,
      receiptNumber: 'INV-002',
    },
  });

  // Create Reports
  await prisma.report.create({
    data: {
      title: 'Laporan Penjualan Harian',
      content: 'Total pendapatan hari ini: Rp 100.000',
    },
  });
  await prisma.report.create({
    data: {
      title: 'Laporan Pesanan Belum Selesai',
      content: 'Ada 2 pesanan yang belum selesai.',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
