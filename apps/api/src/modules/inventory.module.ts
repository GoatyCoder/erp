import { Module } from '@nestjs/common';
import { InventoryApiModule } from '../../../../libs/inventory/src/api/inventory.api.module';

@Module({ imports: [InventoryApiModule] })
export class InventoryModule {}
