import { Module } from '@nestjs/common';
import { IdentityApiModule } from '@core/identity/identity.api.module';
import { MasterdataApiModule } from '@core/masterdata/masterdata.api.module';

@Module({ imports: [IdentityApiModule, MasterdataApiModule] })
export class CoreModule {}
