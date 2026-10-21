# Kasus Uji DTO

## RegisterDto

### Valid
1. `{ "nama": "Budi Santoso", "sekolah": "SMK 5 Malang", "email": "budi@mail.com", "password": "rahasia123", "konfirmasiPassword": "rahasia123" }` → **201**
2. `{ "nama": "Test Sama", "sekolah": "SMK Test", "email": "sama3@test.com", "password": "rahasia123", "konfirmasiPassword": "rahasia123" }` → **201**
3. `{ "nama": "Test Normal", "sekolah": "SMK Test", "email": "  Test2@Mail.COM  ", "password": "rahasia123", "konfirmasiPassword": "rahasia123" }` → **201** (email jadi `test2@mail.com`)

### Tidak Valid
1. `{ "nama": "Bu", ... }` → **422**, field `nama` (minimal 3 karakter)
2. `{ "email": "bukan-email", ... }` → **422**, field `email` (format salah)
3. `{ "password": "rahasia", ... }` → **422**, field `password` (tanpa angka)
4. `{ "password": "rahasia123", "konfirmasiPassword": "beda456" }` → **422**, field `konfirmasiPassword` (tidak cocok)
5. `{ "role": "mentor", ... }` → **422**, field `role` (properti tidak diizinkan)

## LoginDto

### Valid
1. `{ "email": "testrefresh@example.com", "password": "rahasia123" }` → **200**
2. `{ "email": "mentor@example.com", "password": "mentor12345" }` → **200**

### Tidak Valid
1. `{ "email": "bukan-email", "password": "rahasia123" }` → **422**, field `email`
2. `{ "email": "testrefresh@example.com", "password": "" }` → **422**, field `password`
3. `{}` → **422**, field `email` & `password`

## UpdateProfilDto

### Valid
1. `{ "nama": "Budi" }` → **200**
2. `{ "telepon": "08123456789" }` → **200**

### Tidak Valid
1. `{ "nama": "Bu" }` → **422**, field `nama`
2. `{ "telepon": "bukan-angka" }` → **422**, field `telepon`
3. `{ "role": "mentor" }` → **422**, field `role` (properti tidak diizinkan)
4. `{ "password": "rahasia123" }` → **422**, field `password` (properti tidak diizinkan)
5. `{ "id": 999 }` → **422**, field `id` (properti tidak diizinkan)

## CreateJurnalDto

### Valid
1. `{ "kegiatan": "Belajar Node.js dan Express" }` → **201**
2. `{ "kegiatan": "Belajar testing nested", "lampiran": [{ "url": "https://a.com/1", "keterangan": "Screenshot 1" }, { "url": "https://a.com/2" }] }` → **201**

### Tidak Valid
1. `{ "kegiatan": "Belajar" }` → **422**, field `kegiatan` (kurang 10 karakter)
2. `{}` → **422**, field `kegiatan` (wajib diisi)
3. `{ "kegiatan": "Belajar Express", "pesertaId": 1 }` → **422**, field `pesertaId` (properti tidak diizinkan)
4. `{ "kegiatan": "Belajar Express", "lampiran": [{ "url": "https://a.com/1" }, { "url": "bukan-url" }] }` → **422**, field `lampiran.1.url`
5. `{ "kegiatan": "Belajar Express", "lampiran": [6 item] }` → **422**, field `lampiran` (maksimal 5)

## ReviewJurnalDto

### Valid
1. `{ "statusReview": "belum" }` → **200**
2. `{ "statusReview": "sudah", "catatan": "Bagus" }` → **200** (pas 5 karakter)

### Tidak Valid
1. `{ "statusReview": "sudah" }` → **422**, field `catatan` (wajib diisi)
2. `{ "statusReview": "sudah", "catatan": "Ok" }` → **422**, field `catatan` (minimal 5 karakter)
3. `{ "statusReview": "salah" }` → **422**, field `statusReview` (harus belum/sudah)

## IdParamDto

### Valid
1. `/api/v1/jurnal/11` → **200**

### Tidak Valid
1. `/api/v1/peserta/abc` → **422**, field `id` (harus bilangan bulat)
2. `/api/v1/peserta/0` → **422**, field `id` (minimal 1)

## ListPesertaQueryDto

### Valid
1. `/api/v1/peserta` → **200**
2. `/api/v1/peserta?page=2&limit=5` → **200**

### Tidak Valid
1. `?page=abc` → **422**, field `page`
2. `?limit=1000` → **422**, field `limit` (maksimal 100)
3. `?sortBy=password` → **422**, field `sortBy`

## ListJurnalQueryDto

### Valid
1. `/api/v1/jurnal` → **200**

### Tidak Valid
1. `?statusReview=salah` → **422**, field `statusReview`
2. `?belumDireview=abc` → **422**, field `belumDireview`