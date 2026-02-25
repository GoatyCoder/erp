import { Module } from '@nestjs/common';
import { ReceivingApiModule } from '@receiving/api/receiving.api.module';

@Module({ imports: [ReceivingApiModule] })
export class ReceivingModule {}
