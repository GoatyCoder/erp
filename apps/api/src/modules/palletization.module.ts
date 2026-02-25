import { Module } from '@nestjs/common';
import { PalletizationApiModule } from '../../../../libs/palletization/src/api/palletization.api.module';

@Module({ imports: [PalletizationApiModule] })
export class PalletizationModule {}
