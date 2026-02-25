# ML Service (Flask)

ML/data API serving Tirana listing data, price prediction, and comparable properties.

- Default URL: `http://127.0.0.1:5001`
- Dataset file: `ml/tirana_house_prices.json`

## Tech

- Python 3.11+
- Flask
- pandas / scikit-learn / xgboost

## Setup

```bash
cd ml
python3.11 -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

## Train Model (optional / first time)

```bash
python ml_model.py
```

This generates model artifacts (joblib files) used by prediction.

## Run API

```bash
python app.py
```

## Endpoints

- `GET /health` health check
- `GET /listings` listing browser data
- `GET /listings/<id>` full listing details
- `POST /predict` estimated price + low/high range
- `GET /comps/<id>` similar properties

## Example Checks

```bash
curl -s http://127.0.0.1:5001/health
curl -s "http://127.0.0.1:5001/listings?limit=3"
curl -s -X POST http://127.0.0.1:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"main_property_property_square":85,"main_property_property_composition_bedrooms":2,"lat":41.32795,"lng":19.81902}'
```

## Troubleshooting

- If xgboost fails with `libomp.dylib` on macOS:

```bash
brew install libomp
```

- If port conflict occurs:
  - check with `lsof -nP -iTCP:5001 -sTCP:LISTEN`
  - stop conflicting process or use another port.

