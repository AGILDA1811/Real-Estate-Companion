import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EstimateModule } from './modules/estimate/estimate.module';
import { ListingsModule } from './modules/listings/listings.module';

@Module({
  imports: [EstimateModule, ListingsModule],
  controllers: [AppController],
})
export class AppModule {}
