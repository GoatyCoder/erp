import { Module } from '@nestjs/common';
import { InventoryApiModule } from '@inventory/api/inventory.api.module';

@Module({ imports: [InventoryApiModule] })
export class InventoryModule {}
