import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ListingsService } from './listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  async getListings(@Query('limit') limit?: string) {
    const parsedLimit = Number(limit);
    const safeLimit =
      Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 100) : 20;

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
}
