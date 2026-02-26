import { Module } from '@nestjs/common';
import { ReceivingApiModule } from '../../../../libs/receiving/src/api/receiving.api.module';

@Module({ imports: [ReceivingApiModule] })
export class ReceivingModule {}
