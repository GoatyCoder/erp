import { Module } from '@nestjs/common';
import { ProductionApiModule } from '@production/api/production.api.module';

@Module({ imports: [ProductionApiModule] })
export class ProductionModule {}
