# 💾 Implementasi Caching Redis di Express.js

Dokumen ini menjelaskan strategi efektif untuk mengimplementasikan caching data Posts menggunakan Redis di aplikasi Express.js/Node.js Anda, khususnya mengatasi masalah data basi (stale data) saat terjadi pembaruan.

## 1. Masalah Utama: Data Basi (Stale Data)

Ketika Anda menggunakan caching Redis dengan TTL (Time-To-Live), data lama akan tersimpan di cache meskipun data di database sudah di-update. Pengguna akan tetap melihat data lama sampai TTL cache tersebut habis.

**Solusi:** Terapkan Cache Invalidation (Pembatalan Cache) menggunakan strategi Cache-Aside Pattern dan perintah Redis SCAN.

## 2. Strategi Caching yang Benar (Cache-Aside Pattern)

Untuk memaksimalkan manfaat Redis, selalu cek cache terlebih dahulu sebelum melakukan query ke database.

### Fungsi getPosts (Read Operation)

Pada controller yang mengambil data (getPosts), ubah alur menjadi:

1.  **Buat Key Unik:** Tentukan key unik berdasarkan semua parameter query (misalnya: `getPosts:search:page:limit:sort:order:active`).
2.  **Cek Cache:** Coba ambil data dari Redis menggunakan key tersebut.
3.  **Cache Hit:** Jika ada, kembalikan data langsung dari Redis.
4.  **Cache Miss:** Jika tidak ada, baru query data dari Database (Prisma).
5.  **Set Cache:** Simpan hasil query (data dan total) ke Redis, sertakan TTL (misalnya `EX: 300` detik).
6.  **Kirim Respons:** Kembalikan data kepada pengguna.

## 3. Solusi Invalidation: Menghapus Cache saat Update

Setiap kali ada operasi penulisan (Create, Update, Delete) yang memengaruhi data `Post`, kita harus menghapus semua key cache yang terkait dari Redis.

### A. Mengapa Menggunakan SCAN (Bukan KEYS)

-   **KEYS:** Memblokir server Redis (bahaya di lingkungan produksi).
-   **SCAN:** Beroperasi secara inkremental (bertahap) dan non-blocking, menjaga performa server tetap stabil.

### B. Implementasi Fungsi deleteKeysByPrefix

Buat fungsi utilitas untuk menghapus key yang diawali dengan prefix (`getPosts:`).

```typescript
/**
 * Menghapus semua key di Redis yang cocok dengan prefix (misal: "getPosts:")
 * menggunakan SCAN untuk non-blocking.
 */
async function deleteKeysByPrefix(prefix: string): Promise<number> {
  let cursor = '0'; // Cursor awal untuk memulai iterasi
  let deletedCount = 0;

  do {
    // Memanggil SCAN dengan MATCH untuk mencari prefix dan COUNT (misal: 100)
    const [nextCursor, keys] = await redis.scan(cursor, {
      MATCH: `${prefix}*`,
      COUNT: 100 // Jumlah key yang diperiksa per iterasi
    });

    cursor = nextCursor; // Update cursor untuk iterasi berikutnya

    if (keys.length > 0) {
      await redis.del(keys); // Hapus key yang ditemukan
      deletedCount += keys.length;
    }
  } while (cursor !== '0'); // Iterasi berlanjut sampai cursor kembali ke '0'

  return deletedCount;
}
```

-   `cursor = '0'`: Nilai awal yang wajib dikirim ke Redis untuk memulai proses scanning. Iterasi berhenti ketika Redis mengembalikan cursor "0".
-   `COUNT: 100`: Batas jumlah key yang diproses dalam satu panggilan SCAN. Ini untuk mencegah latency spike dan menjaga Redis tetap responsif.

### C. Penerapan pada Operasi Penulisan (createPost)

Panggil fungsi invalidation setelah operasi database berhasil.

```typescript
export async function createPost(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Buat/Update data di Database (Prisma)
    const newPost = await prisma.post.create({ data: req.body });

    // 2. Lakukan Cache Invalidation
    await deleteKeysByPrefix("getPosts:"); // Hapus semua cache yang terpengaruh

    // 3. Kirim Respons
    res.status(201).json({
      /* ... */
    });
  } catch (err) {
    next(err);
  }
}
```

## 4. Kelemahan SCAN dan Jaring Pengaman TTL

-   **Kelemahan SCAN:**
    Ada kemungkinan kecil bahwa beberapa key cache terlewatkan (tidak terhapus) jika ada key yang ditambahkan/dihapus secara bersamaan di Redis.

-   **Jaring Pengaman (Safety Net):**
    Jika key terlewatkan oleh SCAN, cache tersebut akan bertahan, tetapi hanya sampai TTL-nya habis. TTL bertindak sebagai garansi waktu maksimal data basi dapat bertahan.

**Kesimpulan:** Menggunakan SCAN untuk invalidation + TTL untuk keamanan adalah praktik terbaik untuk menyeimbangkan performa Redis dan keakuratan data.