import { Module } from '@nestjs/common';
import { PalletizationController } from './palletization.controller';

@Module({ controllers: [PalletizationController] })
export class PalletizationApiModule {}
