import { Body, Controller, Post } from '@nestjs/common';
import { IsIn, IsString } from 'class-validator';

class QcCheckDto {
  @IsString()
  tenantId!: string;
  @IsString()
  targetId!: string;
  @IsIn(['PASS', 'FAIL'])
  outcome!: 'PASS' | 'FAIL';
}

@Controller('quality')
export class QualityController {
  @Post('qc-checks')
  recordQc(@Body() dto: QcCheckDto) {
    return { id: 'qc-1', ...dto };
  }

  @Post('hold')
  holdLot(@Body() dto: { tenantId: string; targetId: string; reason: string }) {
    return { id: 'hold-1', status: 'ON_HOLD', ...dto };
  }

  @Post('release')
  releaseLot(@Body() dto: { tenantId: string; targetId: string }) {
    return { id: 'hold-1', status: 'RELEASED', ...dto };
  }
}
