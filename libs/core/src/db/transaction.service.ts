import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionService {
  async runInTransaction<T>(callback: () => Promise<T>): Promise<T> {
    return callback();
  }
}
