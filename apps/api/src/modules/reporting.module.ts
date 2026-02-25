import { Module } from '@nestjs/common';
import { ReportingApiModule } from '../../../../libs/reporting/src/api/reporting.api.module';

@Module({ imports: [ReportingApiModule] })
export class ReportingModule {}
