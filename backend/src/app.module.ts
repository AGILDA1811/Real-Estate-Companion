import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EstimateModule } from './modules/estimate/estimate.module';
import { ListingsModule } from './modules/listings/listings.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    SharedModule,
    EstimateModule,
    ListingsModule,
    AuthModule,
    AdminModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
