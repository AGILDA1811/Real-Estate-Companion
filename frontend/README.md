# Frontend (React + Vite)

User interface for browsing Tirana listings, applying filters, viewing details, and understanding price estimation evidence.

- Default URL: `http://localhost:5173`
- API base URL expected from env: `http://127.0.0.1:4000`

## Tech

- React
- Vite
- React Router

## Setup

```bash
cd frontend
npm install
```

## Environment

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:4000
```

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Main Pages

- `/apartments`
  - listing grid from API
  - filters: location, min/max price, rooms, bathrooms, min/max sqm, elevator
  - deal filter and load-more behavior
- `/apartments/:id`
  - property details
  - estimated price + fair range
  - comparable properties (Top 5)

## Data Contracts Used

- `GET /listings`
- `GET /listings/:id`
- `GET /listings/:id/comps`
- `POST /estimate`

## Notes

- Cards use preview text with "Load more" per card.
- Full property description is available on details page.
- If you see empty data, check backend and ML health endpoints first.
