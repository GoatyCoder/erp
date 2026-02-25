import { Module } from '@nestjs/common';
import { ReceivingController } from './receiving.controller';
import { ReceivingService } from '../app/receiving.service';
import { AuditService } from '../../../core/src/audit/audit.service';
import { OutboxService } from '../../../core/src/db/outbox.service';
import { TransactionService } from '../../../core/src/db/transaction.service';

@Module({
  controllers: [ReceivingController],
  providers: [ReceivingService, AuditService, OutboxService, TransactionService]
})
export class ReceivingApiModule {}
