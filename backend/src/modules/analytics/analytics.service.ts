import { Injectable } from '@nestjs/common';
import { InMemoryDbService } from '../../shared/in-memory-db.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly db: InMemoryDbService) {}

  getMarketOverview() {
    const listings = this.db.getListings();
    const active = listings.filter((l) => l.status === 'Active');
    const base = active.length ? active : listings;
    const totalPrice = base.reduce((sum, item) => sum + item.price, 0);
    const totalPricePerM2 = base.reduce((sum, item) => sum + item.price / Math.max(item.meters, 1), 0);
    const goodDeals = base.filter((item) => item.price < item.estimatedPrice).length;

    return {
      avgPrice: Math.round(totalPrice / Math.max(base.length, 1)),
      avgPricePerM2: Number((totalPricePerM2 / Math.max(base.length, 1)).toFixed(1)),
      dealRatio: Math.round((goodDeals / Math.max(base.length, 1)) * 100),
      activeListings: active.length,
    };
  }
}
