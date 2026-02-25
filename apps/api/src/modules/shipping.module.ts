import { Module } from '@nestjs/common';
import { ShippingApiModule } from '@shipping/api/shipping.api.module';

@Module({ imports: [ShippingApiModule] })
export class ShippingModule {}
