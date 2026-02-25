import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { EstimateService } from './estimate.service';
import { EstimateRequest } from './estimate.types';

@Controller()
export class EstimateController {
  constructor(private readonly estimateService: EstimateService) {}

  @Post('estimate')
  async estimate(@Body() body: EstimateRequest) {
    const size = Number(body?.size);
    if (!Number.isFinite(size) || size <= 0) {
      throw new BadRequestException('Field "size" must be a positive number.');
    }

    return this.estimateService.estimate({
      ...body,
      size,
    });
  }
}
