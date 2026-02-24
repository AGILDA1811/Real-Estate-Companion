import pandas as pd
import numpy as np
from math import radians, sin, cos, sqrt, atan2

# The 3 most important Tirana landmarks for distance features
TIRANA_CENTERS = {
    "city_center": (41.32795, 19.81902),   # Skanderbeg Square
    "blloku":      (41.31972, 19.81639),   # Blloku neighborhood
    "grand_park":  (41.31667, 19.82917),   # Grand Park / Artificial Lake
}

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate distance in km between two coordinates"""
    R = 6371
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)*2 + cos(lat1)*cos(lat2)*sin(dlon/2)*2
    return R * 2 * atan2(sqrt(a), sqrt(1-a))

def build_features(df):
    """Take clean dataframe and return feature matrix X and target y"""
    
    df = df.copy()
    
    # Distance features from each landmark
    for name, (lat, lng) in TIRANA_CENTERS.items():
        df[f"dist_{name}"] = df.apply(
            lambda row: haversine_distance(
                row["main_property_location_lat"],
                row["main_property_location_lng"],
                lat, lng
            ), axis=1
        )
    
    # Total rooms feature
    room_cols = [
        "main_property_property_composition_bedrooms",
        "main_property_property_composition_bathrooms",
        "main_property_property_composition_living_rooms",
    ]
    available = [c for c in room_cols if c in df.columns]
    df["total_rooms"] = df[available].sum(axis=1)
    
    # Select final features for the model
    feature_cols = [
        "main_property_property_square",      # area
        "main_property_property_composition_bedrooms",
        "main_property_property_composition_bathrooms",
        "main_property_floor",
        "main_property_has_elevator",
        "main_property_has_parking_space",
        "main_property_has_garage",
        "main_property_has_terrace",
        "total_rooms",
        "dist_city_center",
        "dist_blloku",
        "dist_grand_park",
    ]
    
    available_features = [c for c in feature_cols if c in df.columns]
    
    X = df[available_features].fillna(0)
    y = np.log(df["price_in_euro"])  # log-transform the target
    
    print(f"Feature matrix shape: {X.shape}")
    print(f"Features used: {available_features}")
    return X, y, available_features


if _name_ == "_main_":
    from data_cleaning import load_and_clean_data
    df = load_and_clean_data()
    X, y, features = build_features(df)
    print(X.head())
