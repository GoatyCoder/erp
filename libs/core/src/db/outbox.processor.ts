import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);

  async processPending() {
    this.logger.log('processing pending outbox messages (stub)');
  }
}
