/*
  Warnings:

  - Added the required column `estimatedDuration` to the `ServiceType` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('DITERIMA', 'DICUCI', 'SIAP_DIAAMBIL', 'SELESAI', 'DIBATALKAN');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "items" TEXT,
ADD COLUMN     "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "quantity" INTEGER,
ADD COLUMN     "receiptNumber" TEXT,
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'DITERIMA',
ADD COLUMN     "weight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ServiceType" ADD COLUMN     "estimatedDuration" INTEGER NOT NULL;
