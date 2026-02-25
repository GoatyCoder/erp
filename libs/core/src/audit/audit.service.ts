import { Injectable, Logger } from '@nestjs/common';

export interface AuditEntry {
  tenantId: string;
  actorUserId: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  reason?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  async log(entry: AuditEntry) {
    this.logger.log(`audit action=${entry.action} tenant=${entry.tenantId} entity=${entry.entityType}:${entry.entityId}`);
  }
}
