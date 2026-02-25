import { BadGatewayException, Injectable } from '@nestjs/common';
import { InMemoryDbService, Listing } from '../../shared/in-memory-db.service';

type RawListing = {
  price_in_euro?: number;
  main_property_property_square?: number;
  main_property_property_composition_bedrooms?: number;
  main_property_property_composition_bathrooms?: number;
  main_property_floor?: number;
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
    const mapped = data.map((item, index) => this.toListing(item, String(index + 1)));
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

  private toListing(item: RawListing, id: string): Listing {
    return {
      id,
      title: 'Tirana apartment',
      price: Number(item.price_in_euro) || 0,
      meters: Number(item.main_property_property_square) || 0,
      rooms: Number(item.main_property_property_composition_bedrooms) || 0,
      bathrooms: Number(item.main_property_property_composition_bathrooms) || 0,
      floor: Number(item.main_property_floor) || 0,
      location: 'Tirana',
      description: 'Listing loaded from ML dataset.',
      status: 'Active',
      estimatedPrice: 0,
    };
  }
}
