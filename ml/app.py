from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

from ml_model import predict_price, get_comps
from data_cleaning import load_and_clean_data

app = Flask(__name__)
CORS(app)

# Load data once when the server starts
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
df = load_and_clean_data(os.path.join(BASE_DIR, "tirana_house_prices.json"))

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "ML API is running"})


@app.route("/listings", methods=["GET"])
def get_listings():
    # Get filter params from URL
    limit = int(request.args.get("limit", 20))
    min_price = float(request.args.get("min_price", 0))
    max_price = float(request.args.get("max_price", 9999999))
    min_area = float(request.args.get("min_area", 0))
    max_area = float(request.args.get("max_area", 9999999))
    bedrooms = request.args.get("bedrooms", None)

    filtered = df[
        (df["price_in_euro"] >= min_price) &
        (df["price_in_euro"] <= max_price) &
        (df["main_property_property_square"] >= min_area) &
        (df["main_property_property_square"] <= max_area)
    ]

    if bedrooms:
        filtered = filtered[
            filtered["main_property_property_composition_bedrooms"] == int(bedrooms)
        ]

    listings = filtered.head(limit)[[
        "price_in_euro",
        "main_property_price_currency",
        "main_property_property_square",
        "main_property_property_composition_bedrooms",
        "main_property_property_composition_bathrooms",
        "main_property_property_composition_living_rooms",
        "main_property_property_composition_balconies",
        "main_property_property_composition_kitchens",
        "main_property_floor",
        "main_property_property_type",
        "main_property_property_status",
        "main_property_location_lat",
        "main_property_location_lng",
        "main_property_location_city_zone_city_city_name",
        "main_property_location_city_zone_formatted_address",
        "main_property_furnishing_status",
        "main_property_has_elevator",
        "main_property_has_parking_space",
        "main_property_has_garage",
        "main_property_has_terrace",
        "main_property_has_garden",
        "main_property_has_carport",
        "main_property_description_text_content_original_text",
    ]].copy()

    listings = listings.fillna(0)
    listings.index = range(len(listings))
    listings.insert(0, "id", listings.index + 1)

    return jsonify(listings.to_dict(orient="records"))


@app.route("/listings/<int:listing_id>", methods=["GET"])
def get_listing(listing_id):
    if listing_id >= len(df):
        return jsonify({"error": "Listing not found"}), 404

    listing = df.iloc[listing_id].fillna(0).to_dict()
    return jsonify(listing)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    result = predict_price(data)
    return jsonify(result)


@app.route("/comps/<int:listing_id>", methods=["GET"])
def get_comps_endpoint(listing_id):
    if listing_id >= len(df):
        return jsonify({"error": "Listing not found"}), 404

    listing = df.iloc[listing_id].fillna(0).to_dict()
    property_dict = {
        "lat": listing.get("main_property_location_lat", 41.32795),
        "lng": listing.get("main_property_location_lng", 19.81902),
        "main_property_property_square": listing.get("main_property_property_square", 0)
    }

    comps = get_comps(property_dict, n=5)
    return jsonify(comps)

if __name__ == "__main__":
    print("Starting ML API server...")
    print("Endpoints available:")
    print("  GET  /health")
    print("  GET  /listings")
    print("  GET  /listings/<id>")
    print("  POST /predict")
    print("  GET  /comps/<id>")
    app.run(debug=True, host="0.0.0.0", port=5001)
