import { Module } from '@nestjs/common';
import { ReportingApiModule } from '@reporting/api/reporting.api.module';

@Module({ imports: [ReportingApiModule] })
export class ReportingModule {}
