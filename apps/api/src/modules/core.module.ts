import { Module } from '@nestjs/common';
import { IdentityApiModule } from '../../../../libs/core/src/identity/identity.api.module';
import { MasterdataApiModule } from '../../../../libs/core/src/masterdata/masterdata.api.module';

@Module({ imports: [IdentityApiModule, MasterdataApiModule] })
export class CoreModule {}
