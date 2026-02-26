import { Module } from '@nestjs/common';
import { ShippingApiModule } from '../../../../libs/shipping/src/api/shipping.api.module';

@Module({ imports: [ShippingApiModule] })
export class ShippingModule {}
