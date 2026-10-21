# Uji Tembak — 14 Payload

| No | Payload | Hasil Test | Status |
|----|---------|------------|--------|
| 1 | Body kosong `{}` pada register | 422, detail semua field wajib | ✅ |
| 2 | Body array `[]` | 422, "body harus berupa objek" | ✅ |
| 3 | Content-Type text/plain dengan isi JSON valid | 422, detail semua field wajib | ✅ |
| 4 | Tipe salah: `{ "nama": 123, "email": true }` | 422, field nama & email | ✅ |
| 5 | Nama hanya spasi `"      "` | 422, "nama minimal 3 karakter" | ✅ |
| 6 | Nama 10.000 karakter | 422, "nama maksimal 100 karakter" | ✅ |
| 7 | Properti asing `{ "role": "mentor" }` | 422, "role: Properti ini tidak diizinkan" | ✅ |
| 8 | Email `"  Budi@Mail.COM  "` | 201, email jadi `budi@mail.com` | ✅ |
| 9 | Password 100 karakter | 422, "password maksimal 72 karakter" | ✅ |
| 10 | Query ganda `?sekolah=a&sekolah=b` | 200, tampil semua | ✅ |
| 11 | Query objek `?page[x]=1&limit[]=5` | 422 | ✅ |
| 12 | Body 2 MB | **413 PAYLOAD_TOO_LARGE** | ✅ |
| 13 | Nama berisi SQL `"'; DROP TABLE peserta; --"` | 201, aman (query berparameter) | ✅ |
| 14 | Nama berisi HTML `"<script>alert(1)</script>"` | 201, aman di React (auto-escape) | ✅ |

**Status: 14 dari 14 payload lolos.** ✅

## Jawaban Pertanyaan

### 1. Kenapa payload 13 (SQL injection) aman walau diterima?

Karena TypeORM memakai query berparameter. Waktu kita panggil `repo.save()`, TypeORM otomatis escape input. Input `"'; DROP TABLE peserta; --"` disimpan sebagai teks biasa, bukan dieksekusi sebagai SQL. Ini beda dengan string concatenation yang rentan.

### 2. Payload 14 (HTML) diterima validasi. Kenapa tidak otomatis berbahaya di React?

Validasi cuma cek tipe & panjang — gak cek HTML. HTML masuk ke database sebagai teks. Tapi ini aman karena:
- React otomatis escape HTML waktu render (`{nama}` → tampil sebagai teks, bukan di-render sebagai tag).
- Kalo pake `dangerouslySetInnerHTML`, itu baru berbahaya.

Lapisan yang bertanggung jawab mencegah: Frontend (React) — yang nge-render data dengan aman. Bukan backend.

Kalo ada aplikasi lain (mobile, terminal, dll) yang nampilin data tanpa escape, itu tanggung jawab aplikasi itu.