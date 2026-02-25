import { Module } from '@nestjs/common';
import { CoreModule } from './modules/core.module';
import { ReceivingModule } from './modules/receiving.module';
import { QualityModule } from './modules/quality.module';
import { ProductionModule } from './modules/production.module';
import { PalletizationModule } from './modules/palletization.module';
import { InventoryModule } from './modules/inventory.module';
import { ShippingModule } from './modules/shipping.module';
import { ReportingModule } from './modules/reporting.module';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  imports: [
    CoreModule,
    ReceivingModule,
    QualityModule,
    ProductionModule,
    PalletizationModule,
    InventoryModule,
    ShippingModule,
    ReportingModule
  ]
})
export class AppModule {}
