import { Module } from '@nestjs/common';
import { PalletizationApiModule } from '@palletization/api/palletization.api.module';

@Module({ imports: [PalletizationApiModule] })
export class PalletizationModule {}
