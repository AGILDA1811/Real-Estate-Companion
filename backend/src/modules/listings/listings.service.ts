import { BadGatewayException, Injectable } from '@nestjs/common';
import { InMemoryDbService, Listing } from '../../shared/in-memory-db.service';

type RawListing = {
  id?: number;
  price_in_euro?: number;
  main_property_price_currency?: string;
  main_property_property_square?: number;
  main_property_property_composition_bedrooms?: number;
  main_property_property_composition_bathrooms?: number;
  main_property_property_composition_living_rooms?: number;
  main_property_property_composition_balconies?: number;
  main_property_property_composition_kitchens?: number;
  main_property_floor?: number;
  main_property_property_type?: string;
  main_property_property_status?: string;
  main_property_location_lat?: number;
  main_property_location_lng?: number;
  main_property_location_city_zone_city_city_name?: string;
  main_property_location_city_zone_formatted_address?: string;
  main_property_furnishing_status?: string;
  main_property_has_elevator?: boolean;
  main_property_has_parking_space?: boolean;
  main_property_has_garage?: boolean;
  main_property_has_terrace?: boolean;
  main_property_has_garden?: boolean;
  main_property_has_carport?: boolean;
  main_property_description_text_content_original_text?: string;
};

type RawComp = {
  price_in_euro?: number;
  main_property_property_square?: number;
  main_property_property_composition_bedrooms?: number;
  main_property_location_lat?: number;
  main_property_location_lng?: number;
};

@Injectable()
export class ListingsService {
  private readonly mlBaseUrl = process.env.ML_API_BASE_URL || 'http://127.0.0.1:5001';
  constructor(private readonly db: InMemoryDbService) {}

  async getListings(limit = 100000) {
    const url = new URL(`${this.mlBaseUrl}/listings`);
    url.searchParams.set('limit', String(limit));

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new BadGatewayException('ML listings endpoint is unavailable.');
    }

    const data = (await res.json()) as RawListing[];
    const mapped = data.map((item, index) => this.toListing(item, String(item.id || index + 1)));
    this.db.setListings(mapped);
    return mapped;
  }

  async getListingById(id: string) {
    const numericId = Number(id) - 1;
    if (!Number.isInteger(numericId) || numericId < 0) {
      return null;
    }

    const res = await fetch(`${this.mlBaseUrl}/listings/${numericId}`);
    if (res.status === 404) return null;
    if (!res.ok) {
      throw new BadGatewayException('ML listing details endpoint is unavailable.');
    }

    const item = (await res.json()) as RawListing;
    return this.toListing(item, id);
  }

  async getComparableListings(id: string, n = 5) {
    const numericId = Number(id) - 1;
    if (!Number.isInteger(numericId) || numericId < 0) {
      return [];
    }

    const [subjectRes, compsRes] = await Promise.all([
      fetch(`${this.mlBaseUrl}/listings/${numericId}`),
      fetch(`${this.mlBaseUrl}/comps/${numericId}`),
    ]);

    if (!subjectRes.ok || !compsRes.ok) {
      throw new BadGatewayException('ML comps endpoint is unavailable.');
    }

    const subject = (await subjectRes.json()) as RawListing;
    const comps = (await compsRes.json()) as RawComp[];

    const subjectLat = Number(subject.main_property_location_lat) || 41.32795;
    const subjectLng = Number(subject.main_property_location_lng) || 19.81902;
    const subjectSqm = Number(subject.main_property_property_square) || 0;
    const subjectBeds = Number(subject.main_property_property_composition_bedrooms) || 0;

    return comps.slice(0, n).map((comp, index) => {
      const compSqm = Number(comp.main_property_property_square) || 0;
      const compBeds = Number(comp.main_property_property_composition_bedrooms) || 0;
      const distanceKm = this.haversineKm(
        subjectLat,
        subjectLng,
        Number(comp.main_property_location_lat) || subjectLat,
        Number(comp.main_property_location_lng) || subjectLng,
      );
      const sizeDiff = Math.abs(subjectSqm - compSqm);
      const bedDiff = Math.abs(subjectBeds - compBeds);

      return {
        id: `comp-${id}-${index + 1}`,
        price: Number(comp.price_in_euro) || 0,
        meters: compSqm,
        rooms: compBeds,
        distanceKm: Number(distanceKm.toFixed(2)),
        reason: `${distanceKm.toFixed(2)} km away, ${sizeDiff.toFixed(
          1,
        )} m² size difference, ${bedDiff} bedroom difference`,
      };
    });
  }

  private toListing(item: RawListing, id: string): Listing {
    const city = String(item.main_property_location_city_zone_city_city_name || '').trim();
    const address = String(item.main_property_location_city_zone_formatted_address || '').trim();
    const type = String(item.main_property_property_type || '').trim();
    const status = String(item.main_property_property_status || '').trim();
    const description = String(item.main_property_description_text_content_original_text || '').trim();
    const displayLocation = address || city || 'Unknown location';
    const displayTitle = type ? `${type} in ${city || 'Tirana'}` : 'Property listing';

    return {
      id,
      title: displayTitle,
      price: Number(item.price_in_euro) || 0,
      meters: Number(item.main_property_property_square) || 0,
      rooms: Number(item.main_property_property_composition_bedrooms) || 0,
      bathrooms: Number(item.main_property_property_composition_bathrooms) || 0,
      floor: Number(item.main_property_floor) || 0,
      location: displayLocation,
      address: address || city || 'Unknown address',
      description: description || `${type || 'Property'} (${status || 'for_sale'})`,
      furnishing: String(item.main_property_furnishing_status || '').trim() || 'unknown',
      hasElevator: Boolean(item.main_property_has_elevator),
      hasTerrace: Boolean(item.main_property_has_terrace),
      hasGarage: Boolean(item.main_property_has_garage),
      hasParking: Boolean(item.main_property_has_parking_space),
      lat: Number(item.main_property_location_lat) || 0,
      lng: Number(item.main_property_location_lng) || 0,
      propertyType: type || 'property',
      propertyStatus: status || 'for_sale',
      status: 'Active',
      estimatedPrice: 0,
    };
  }

  private haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}
