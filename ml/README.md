# ML Pipeline — Tirana Real Estate

## Setup
```bash
cd ml
python -m venv venv
source venv/Scripts/activate  # Windows
pip install -r requirements.txt
```

## Run

**Step 1 — Train the model (only once):**
```bash
python ml_model.py
```

**Step 2 — Start the API:**
```bash
python app.py
```

API runs on `http://127.0.0.1:5000`

## Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Check API status |
| `/listings` | GET | Get all listings |
| `/listings/<id>` | GET | Get one listing |
| `/predict` | POST | Get price estimate |
| `/comps/<id>` | GET | Get similar properties |