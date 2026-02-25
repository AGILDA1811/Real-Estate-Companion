# Backend API (NestJS)

NestJS backend acting as BFF/API layer between frontend and ML service.

- Default URL: `http://127.0.0.1:4000`
- Depends on ML API: `http://127.0.0.1:5001`

## Tech

- NestJS 10
- TypeScript

## Setup

```bash
cd backend
npm install
```

## Run

```bash
npm run start:dev
```

## Build

```bash
npm run build
```

## Environment

Create `backend/.env` (optional):

```env
PORT=4000
ML_API_BASE_URL=http://127.0.0.1:5001
```

## API Endpoints

### Health

- `GET /health`

### Listings

- `GET /listings?limit=100`
- `GET /listings/:id`
- `GET /listings/:id/comps?limit=5`

### Estimation

- `POST /estimate`

Request body:

```json
{
  "id": "listing-1",
  "price": 120000,
  "size": 85,
  "rooms": 2,
  "location": "Tirana"
}
```

Response body:

```json
{
  "estimatedPrice": 128000,
  "low": 115000,
  "high": 141000,
  "confidence": 0.74,
  "explanation": "Estimated by ML model using size/rooms and Tirana location features."
}
```

### Auth (MVP mock auth)

- `POST /auth/signup`
- `POST /auth/login`

### Admin (MVP)

- `GET /admin/stats`
- `GET /admin/listings`
- `PATCH /admin/listings/:id`
- `DELETE /admin/listings/:id`
- `GET /admin/users`
- `PATCH /admin/users/:id`
- `DELETE /admin/users/:id`

### Analytics (MVP)

- `GET /analytics/market`

## Behavior Notes

- `POST /estimate` has fallback logic if ML prediction is unavailable.
- Listing endpoints currently rely on ML dataset endpoints.

## Troubleshooting

- If `/listings` fails, ensure ML API is running on `5001`.
- Verify with:

```bash
curl -s http://127.0.0.1:5001/health
```
