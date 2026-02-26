import { Body, Controller, Post } from '@nestjs/common';
import { IsIn, IsString } from 'class-validator';
import { DemoStoreService } from '../../../core/src/shared/demo-store.service';

class QcCheckDto {
  @IsString() tenantId!: string;
  @IsString() targetId!: string;
  @IsIn(['PASS', 'FAIL']) outcome!: 'PASS' | 'FAIL';
}

@Controller('quality')
export class QualityController {
  constructor(private readonly store: DemoStoreService) {}

  @Post('qc-checks')
  recordQc(@Body() dto: QcCheckDto) {
    return { id: 'qc-' + Date.now(), ...dto };
  }

  @Post('hold')
  holdLot(@Body() dto: { tenantId: string; targetId: string; reason: string }) {
    const lot = this.store.lots.find((x) => x.id === dto.targetId && x.tenantId === dto.tenantId);
    if (lot) lot.status = 'ON_HOLD';
    return { id: 'hold-' + Date.now(), status: 'ON_HOLD', ...dto };
  }

  @Post('release')
  releaseLot(@Body() dto: { tenantId: string; targetId: string }) {
    const lot = this.store.lots.find((x) => x.id === dto.targetId && x.tenantId === dto.tenantId);
    if (lot) lot.status = 'RELEASED';
    return { id: 'hold-' + Date.now(), status: 'RELEASED', ...dto };
  }
}
