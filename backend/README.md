# Backend (Nest.js) - Phase 1

Simple BFF API for frontend integration on `http://localhost:4000`.

## Endpoints

- `GET /health`
- `POST /auth/signup`
- `POST /auth/login`
- `POST /estimate`
- `GET /listings?limit=20`
- `GET /listings/:id`
- `GET /analytics/market`
- `GET /admin/stats`
- `GET /admin/listings`
- `PATCH /admin/listings/:id`
- `DELETE /admin/listings/:id`
- `GET /admin/users`
- `PATCH /admin/users/:id`
- `DELETE /admin/users/:id`

## `POST /estimate` request body

```json
{
  "id": "tool-1",
  "price": 120000,
  "size": 85,
  "rooms": 2,
  "location": "Tirana"
}
```

## `POST /estimate` response

```json
{
  "estimatedPrice": 128000,
  "confidence": 0.74,
  "explanation": "Estimated by ML model using size/rooms and Tirana location features."
}
```

## Run

1. Start ML API first:

```bash
cd ml
python app.py
```

2. Start Nest.js backend:

```bash
cd backend
npm install
npm run start:dev
```

By default it uses:

- `PORT=4000`
- `ML_API_BASE_URL=http://127.0.0.1:5001`

If ML API is offline:

- `POST /estimate` returns a safe fallback estimate.
- `GET /listings` falls back to in-memory demo data.
