import { Module } from '@nestjs/common';
import { QualityApiModule } from '@quality/api/quality.api.module';

@Module({ imports: [QualityApiModule] })
export class QualityModule {}
