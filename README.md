# Tirana Real Estate Companion

Full-stack real-estate MVP for Tirana listings with ML-assisted pricing.

This project combines:
- a React frontend for browsing/filtering listings,
- a NestJS backend (BFF/API layer),
- a Flask ML API for price estimation and comparable properties.

The app is designed for local demo and hackathon delivery.

## Features

- Listings browser from the provided dataset (`tirana_house_prices.json`)
- Advanced filters (price, rooms, bathrooms, sqm, elevator)
- Listing details page with core property fields and full description
- ML estimated price with fair range (`low-high`)
- Comparable listings (Top 5) with similarity explanation
- Deal context (difference in EUR and %)
- Compare flow for selected properties

## Project Structure

- `frontend/` React + Vite UI
- `backend/` NestJS API/BFF on port `4000`
- `ml/` Flask ML/data API on port `5001`

## Prerequisites

- Node.js 18+
- npm 9+
- Python 3.11+
- macOS/Linux terminal

## Local Run (3 terminals)

### 1) ML API

```bash
cd /Users/agildakulli/Desktop/kursi/Real-Estate-Companion/ml
python3.11 -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
python app.py
```

Expected: ML API on `http://127.0.0.1:5001`

### 2) Backend API

```bash
cd /Users/agildakulli/Desktop/kursi/Real-Estate-Companion/backend
npm install
npm run start:dev
```

Expected: backend on `http://127.0.0.1:4000`

### 3) Frontend

```bash
cd /Users/agildakulli/Desktop/kursi/Real-Estate-Companion/frontend
npm install
npm run dev
```

Expected: frontend on `http://localhost:5173`

## Environment

Frontend (`frontend/.env`):

```env
VITE_API_BASE_URL=http://127.0.0.1:4000
```

Backend (`backend/.env`, optional):

```env
PORT=4000
ML_API_BASE_URL=http://127.0.0.1:5001
```

## Quick Health Checks

```bash
curl -s http://127.0.0.1:5001/health
curl -s http://127.0.0.1:4000/health
curl -s "http://127.0.0.1:4000/listings?limit=3"
```

## Core Flow for Demo (2-3 min)

1. Open `/apartments`
2. Filter by price/rooms/bathrooms/sqm/elevator
3. Open one listing (`View details`)
4. Show estimated price + fair range
5. Show comparable properties and why they are similar

## Data Source

- Required dataset file: `ml/tirana_house_prices.json`
- No paid or external API is required.

## Notes

- `.env` files are ignored in git.
- `node_modules`, `venv`, build folders are ignored.
- If ML port `5000` is occupied on macOS (AirPlay), this project uses `5001` by default.

## Module READMEs

- [Backend guide](./backend/README.md)
- [Frontend guide](./frontend/README.md)
- [ML guide](./ml/README.md)
