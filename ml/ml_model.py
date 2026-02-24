import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, r2_score

from data_cleaning import load_and_clean_data
from feature_engineering import build_features, haversine_distance, TIRANA_CENTERS


def train_and_save_model(filepath="tirana_house_prices.json"):
    """Load data, build features, train XGBoost, save model"""
    
    print("Loading and cleaning data...")
    df = load_and_clean_data(filepath)
    
    print("Building features...")
    X, y, feature_cols = build_features(df)
    
    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print("Training XGBoost model...")
    model = XGBRegressor(
        n_estimators=300,
        learning_rate=0.05,
        max_depth=6,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(np.exp(y_test), np.exp(y_pred))
    r2 = r2_score(y_test, y_pred)
    print(f"MAE: €{mae:,.0f}")
    print(f"R² Score: {r2:.3f}")
    
    # Save model and feature list
    joblib.dump(model, "tirana_price_model.joblib")
    joblib.dump(feature_cols, "feature_names.joblib")
    joblib.dump(TIRANA_CENTERS, "tirana_centers.joblib")
    print("Model saved successfully!")
    
    return model, feature_cols


def predict_price(property_dict):
    """
    Takes a property as a dictionary and returns a price estimate.
    This is what the Flask API will call.
    """
    
    # Load saved model and features
    model = joblib.load("tirana_price_model.joblib")
    feature_cols = joblib.load("feature_names.joblib")
    centers = joblib.load("tirana_centers.joblib")
    
    # Calculate distances from Tirana landmarks
    lat = property_dict.get("lat", 41.32795)
    lng = property_dict.get("lng", 19.81902)
    
    for name, (clat, clng) in centers.items():
        property_dict[f"dist_{name}"] = haversine_distance(lat, lng, clat, clng)
    
    # Calculate total rooms
    property_dict["total_rooms"] = (
        property_dict.get("main_property_property_composition_bedrooms", 0) +
        property_dict.get("main_property_property_composition_bathrooms", 0) +
        property_dict.get("main_property_property_composition_living_rooms", 0)
    )
    
    # Build feature row
    row = pd.DataFrame([property_dict])
    row = row.reindex(columns=feature_cols, fill_value=0)
    
    # Predict (model predicts log price, so we convert back)
    log_price = model.predict(row)[0]
    price = np.exp(log_price)
    
    return {
        "estimate": round(price),
        "low": round(price * 0.90),
        "high": round(price * 1.10)
    }


def get_comps(property_dict, n=5):
    """
    Find n most similar properties to the given one.
    This is what the Flask API will call for comparable properties.
    """
    
    df = load_and_clean_data()
    
    lat = property_dict.get("lat", 41.32795)
    lng = property_dict.get("lng", 19.81902)
    area = property_dict.get("main_property_property_square", 0)
    
    # Calculate similarity score based on distance and area difference
    df["distance_score"] = df.apply(
        lambda row: haversine_distance(
            lat, lng,
            row["main_property_location_lat"],
            row["main_property_location_lng"]
        ), axis=1
    )
    
    df["area_score"] = abs(df["main_property_property_square"] - area)
    
    # Normalize both scores between 0 and 1
    df["distance_score"] = df["distance_score"] / df["distance_score"].max()
    df["area_score"] = df["area_score"] / df["area_score"].max()
    
    # Combined similarity score (lower = more similar)
    df["similarity"] = df["distance_score"] + df["area_score"]
    
    # Return top n most similar
    comps = df.nsmallest(n, "similarity")[[
        "price_in_euro",
        "main_property_property_square",
        "main_property_property_composition_bedrooms",
        "main_property_location_lat",
        "main_property_location_lng",
    ]]
    
    return comps.to_dict(orient="records")


if __name__ == "__main__":
    # This runs the training when you execute: python ml_model.py
    model, features = train_and_save_model()
    
    # Test prediction
    test_property = {
        "main_property_property_square": 85,
        "main_property_property_composition_bedrooms": 2,
        "main_property_property_composition_bathrooms": 1,
        "main_property_floor": 3,
        "main_property_has_elevator": True,
        "main_property_has_parking_space": False,
        "main_property_has_garage": False,
        "main_property_has_terrace": False,
        "lat": 41.32795,
        "lng": 19.81902
    }
    
    result = predict_price(test_property)
    print(f"\nTest Prediction:")
    print(f"  Estimate: €{result['estimate']:,}")
    print(f"  Low:      €{result['low']:,}")
    print(f"  High:     €{result['high']:,}")
    
    comps = get_comps(test_property)
    print(f"\nTop 5 Comparable Properties:")
    for i, comp in enumerate(comps, 1):
        print(f"  {i}. €{comp['price_in_euro']:,} | {comp['main_property_property_square']}m²")