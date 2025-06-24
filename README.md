# Laundryfy
Adalah aplikasi yang digunakan untuk menerima pesanan laundry untuk usaha Laundry Pakaian.


## Tech Stack
- Next JS
- Prisma
- Postgres SQL
- @tanstack/react-query

## Fitur Utama Aplikasi Laundry Anda

### Orders (Pesanan)
Ini adalah inti dari aplikasi Anda. Fitur ini harus memungkinkan pengguna untuk:

- Membuat pesanan baru: Mencatat detail pelanggan, jenis layanan, item laundry, berat/jumlah, tanggal masuk, tanggal janji selesai, dan status pembayaran.
- Melacak status pesanan: Misalnya, "Diterima", "Sedang - Dicuci", "Siap Diambil", "Selesai", "Dibatalkan".
- Mengubah atau membatalkan pesanan: Jika ada perubahan atau pembatalan dari pelanggan.
- Mencetak struk/nota: Untuk pelanggan dan arsip internal.

### Customers (Pelanggan)
Modul ini akan menyimpan dan mengelola informasi pelanggan Anda:

- Menambah/Mengedit informasi pelanggan: Nama, alamat, nomor telepon, email.
- Melihat riwayat pesanan pelanggan: Untuk melacak preferensi atau masalah sebelumnya.
- Mencari pelanggan: Berdasarkan nama atau nomor telepon.

### Service Types (Jenis Layanan)
Fitur ini akan mendefinisikan layanan yang ditawarkan laundry Anda:

- Menambah/Mengedit jenis layanan: Misalnya, "Cuci Kering", "Cuci Basah", "Setrika Saja", "Cuci Selimut".
- Menentukan harga per jenis layanan: Bisa per kilogram, per potong, atau harga tetap.
- Menentukan durasi pengerjaan: Estimasi waktu yang dibutuhkan untuk setiap layanan.

### Reports (Laporan)
- Laporan sangat krusial untuk menganalisis kinerja bisnis:
- Laporan Penjualan: Pendapatan harian, mingguan, bulanan.
- Laporan Pesanan: Jumlah pesanan, pesanan yang belum selesai, pesanan yang dibatalkan.
- Laporan Pelanggan: Pelanggan paling sering, total transaksi per pelanggan.
- Laporan Layanan Populer: Jenis layanan yang paling sering digunakan.