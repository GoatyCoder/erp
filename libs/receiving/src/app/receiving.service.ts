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
}
