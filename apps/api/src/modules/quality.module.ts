import { Module } from '@nestjs/common';
import { QualityApiModule } from '../../../../libs/quality/src/api/quality.api.module';

@Module({ imports: [QualityApiModule] })
export class QualityModule {}
