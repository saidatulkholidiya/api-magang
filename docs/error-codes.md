# Kode Error

| Kode | HTTP | Kapan Terjadi |
|------|------|---------------|
| VALIDATION_ERROR | 422 | Validasi gagal |
| INVALID_JSON | 400 | Body JSON rusak |
| UNAUTHORIZED | 401 | Belum login |
| TOKEN_EXPIRED | 401 | Token expired |
| INVALID_TOKEN | 401 | Token tidak valid |
| FORBIDDEN | 403 | Gak punya hak akses |
| NOT_FOUND | 404 | Data/route gak ada |
| CONFLICT | 409 | Data duplikat |
| RATE_LIMITED | 429 | Terlalu banyak request |
| INTERNAL_ERROR | 500 | Bug server |

## Format Error

```json
{
  "sukses": false,
  "error": {
    "kode": "VALIDATION_ERROR",
    "pesan": "Validasi gagal",
    "detail": [
      { "field": "email", "pesan": "Format email tidak valid" }
    ]
  },
  "requestId": "b7a1c9e2-..."
}# Kode Error

| Kode | HTTP | Kapan Terjadi |
|------|------|---------------|
| VALIDATION_ERROR | 422 | Validasi gagal |
| INVALID_JSON | 400 | Body JSON rusak |
| UNAUTHORIZED | 401 | Belum login |
| TOKEN_EXPIRED | 401 | Token expired |
| INVALID_TOKEN | 401 | Token tidak valid |
| FORBIDDEN | 403 | Gak punya hak akses |
| NOT_FOUND | 404 | Data/route gak ada |
| CONFLICT | 409 | Data duplikat |
| RATE_LIMITED | 429 | Terlalu banyak request |
| INTERNAL_ERROR | 500 | Bug server |

## Format Error

```json
{
  "sukses": false,
  "error": {
    "kode": "VALIDATION_ERROR",
    "pesan": "Validasi gagal",
    "detail": [
      { "field": "email", "pesan": "Format email tidak valid" }
    ]
  },
  "requestId": "b7a1c9e2-..."
}