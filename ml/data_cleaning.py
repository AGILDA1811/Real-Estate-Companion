import pandas as pd
import numpy as np
import json

def load_and_clean_data(filepath="tirana_house_prices.json"):
    # Load JSON
    with open(filepath, "r", encoding="utf-8") as f:
        raw_data = json.load(f)
    
    df = pd.DataFrame(raw_data)
    
    # Remove duplicates
    df = df.drop_duplicates()
    
    # Fill boolean amenities with False (missing = doesn't have it)
    bool_cols = [
        "main_property_has_garden",
        "main_property_has_carport",
        "main_property_has_parking_space",
        "main_property_has_garage",
        "main_property_has_terrace",
        "main_property_has_elevator"
    ]
    for col in bool_cols:
        if col in df.columns:
            df[col] = df[col].fillna(False).astype(bool)
    
    # Fill missing furnishing status
    if "main_property_furnishing_status" in df.columns:
        df["main_property_furnishing_status"] = df["main_property_furnishing_status"].fillna("unknown")
    
    # Remove unrealistic prices
    df = df[df["price_in_euro"] >= 33000]
    df = df[df["price_in_euro"] <= 1000000]
    
    # Remove unrealistic areas
    area_col = "main_property_property_square"
    lower = df[area_col].quantile(0.01)
    upper = df[area_col].quantile(0.99)
    df = df[df[area_col].between(lower, upper)]
    
    # Filter to valid Tirana coordinates
    df = df[
        df["main_property_location_lat"].between(41.25, 41.38) &
        df["main_property_location_lng"].between(19.75, 19.95)
    ]
    
    print(f"Clean dataset shape: {df.shape}")
    return df


if __name__ == "_main_":
    df = load_and_clean_data()
    print(df.head())
