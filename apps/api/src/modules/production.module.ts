import { Module } from '@nestjs/common';
import { ProductionApiModule } from '../../../../libs/production/src/api/production.api.module';

@Module({ imports: [ProductionApiModule] })
export class ProductionModule {}
