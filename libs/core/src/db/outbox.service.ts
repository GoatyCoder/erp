import { Injectable, Logger } from '@nestjs/common';

export interface DomainEvent {
  tenantId: string;
  type: string;
  payload: Record<string, unknown>;
}

@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);

  async enqueue(event: DomainEvent) {
    this.logger.log(`outbox queued type=${event.type} tenant=${event.tenantId}`);
  }
}
