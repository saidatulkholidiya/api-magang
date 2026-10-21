# Kode Error

| Kode | HTTP | Kapan Terjadi |
|------|------|---------------|
| VALIDATION_ERROR | 422 | Validasi gagal |
| INVALID_JSON | 400 | Body JSON rusak |
| UNAUTHORIZED | 401 | Belum login |
| TOKEN_EXPIRED | 401 | Token expired |
| INVALID_TOKEN | 401 | Token tidak valid |
| FORBIDDEN | 403 | Tidak punya hak akses |
| NOT_FOUND | 404 | Data/route tidak ada |
| CONFLICT | 409 | Data duplikat |
| RATE_LIMITED | 429 | Terlalu banyak request |
| PAYLOAD_TOO_LARGE | 413 | Body request terlalu besar |
| INTERNAL_ERROR | 500 | Bug di server |

## Format Error

    {
      "sukses": false,
      "error": {
        "kode": "VALIDATION_ERROR",
        "pesan": "Validasi gagal",
        "detail": [
          { "field": "email", "pesan": "Format email tidak valid" }
        ]
      },
      "requestId": "abc-123"
    }

## Cara Pakai Kode di Frontend

    if (error.kode === "TOKEN_EXPIRED") {
      // Refresh token, coba request ulang
    } else if (error.kode === "VALIDATION_ERROR") {
      // Tampilkan pesan di bawah tiap field
      error.detail.forEach(d => showFieldError(d.field, d.pesan));
    } else if (error.kode === "FORBIDDEN") {
      // Tampilkan "Kamu tidak berhak akses ini"
    }