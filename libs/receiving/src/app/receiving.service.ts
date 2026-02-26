import { Injectable } from '@nestjs/common';
import { AuditService } from '../../../core/src/audit/audit.service';
import { OutboxService } from '../../../core/src/db/outbox.service';
import { TransactionService } from '../../../core/src/db/transaction.service';

@Injectable()
export class ReceivingService {
  constructor(
    private readonly tx: TransactionService,
    private readonly audit: AuditService,
    private readonly outbox: OutboxService
  ) {}

  async createInboundLot(command: { tenantId: string; actorUserId: string; lotCode: string; productId?: string }) {
    return this.tx.runInTransaction(async () => {
      const lot = { id: 'lot-' + command.lotCode, ...command };
      await this.audit.log({
        tenantId: command.tenantId,
        actorUserId: command.actorUserId,
        action: 'CreateInboundLotCommand',
        entityType: 'lot',
        entityId: lot.id,
        after: lot
      });
      await this.outbox.enqueue({
        tenantId: command.tenantId,
        type: 'receiving.inbound-lot.created',
        payload: lot
      });
      return lot;
    });
  }

  async recordInboundWeight(command: {
    tenantId: string;
    actorUserId: string;
    lotId: string;
    grossKg: number;
    tareKg?: number;
  }) {
    return this.tx.runInTransaction(async () => {
      const tareKg = command.tareKg ?? 0;
      const netKg = command.grossKg - tareKg;
      const weighedAt = new Date().toISOString();
      const weightRecord = { ...command, tareKg, netKg, weighedAt };

      await this.audit.log({
        tenantId: command.tenantId,
        actorUserId: command.actorUserId,
        action: 'RecordInboundWeightCommand',
        entityType: 'lot',
        entityId: command.lotId,
        after: weightRecord
      });

      await this.outbox.enqueue({
        tenantId: command.tenantId,
        type: 'receiving.weight.recorded',
        payload: weightRecord
      });

      return weightRecord;
    });
  }
}
