import { Global, Module } from '@nestjs/common';
import { DemoStoreService } from '../../../../libs/core/src/shared/demo-store.service';

@Global()
@Module({ providers: [DemoStoreService], exports: [DemoStoreService] })
export class PlatformModule {}
