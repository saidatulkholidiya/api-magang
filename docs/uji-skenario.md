# Uji Skenario

| No | Skenario | Hasil yang Diharapkan | Hasil Test |
|----|----------|----------------------|------------|
| 1 | Register berhasil | 201 + Location | |
| 2 | Register email duplikat | 409 CONFLICT | |
| 3 | Register email format salah | 422 VALIDATION_ERROR | |
| 4 | Login salah 11 kali | Ke-11: 429 RATE_LIMITED | |
| 5 | Akses /me tanpa token | 401 UNAUTHORIZED | |
| 6 | Akses /me dengan token expired | 401 TOKEN_EXPIRED | |
| 7 | Peserta akses GET /jurnal | 403 FORBIDDEN | |
| 8 | Peserta edit jurnal orang lain | 403 FORBIDDEN | |
| 9 | GET /peserta/9999 | 404 NOT_FOUND | |
| 10 | Body JSON rusak | 400 INVALID_JSON | |
| 11 | page=0&limit=1000&sortBy=password | 200, nilai dikoreksi | |
| 12 | PATCH /me dengan role | role tidak berubah | ✅ (10/14) |
| 13 | DB mati → /health/ready | 503 | |
| 14 | Ctrl+C | Log shutdown rapi | |