import { Module } from '@nestjs/common';
import { ReceivingController } from './receiving.controller';
import { ReceivingService } from '../app/receiving.service';
import { AuditService } from '@core/audit/audit.service';
import { OutboxService } from '@core/db/outbox.service';
import { TransactionService } from '@core/db/transaction.service';

@Module({
  controllers: [ReceivingController],
  providers: [ReceivingService, AuditService, OutboxService, TransactionService]
})
export class ReceivingApiModule {}
