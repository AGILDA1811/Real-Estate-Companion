import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ListingsService } from './listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  async getListings(@Query('limit') limit?: string) {
    const parsedLimit = Number(limit);
    const safeLimit =
      Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 100000) : 100000;

    return this.listingsService.getListings(safeLimit);
  }

  @Get(':id')
  async getListing(@Param('id') id: string) {
    const listing = await this.listingsService.getListingById(id);
    if (!listing) {
      throw new NotFoundException('Listing not found.');
    }
    return listing;
  }

  @Get(':id/comps')
  async getComparableListings(@Param('id') id: string, @Query('limit') limit?: string) {
    const parsedLimit = Number(limit);
    const safeLimit =
      Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 10) : 5;
    return this.listingsService.getComparableListings(id, safeLimit);
  }
}
