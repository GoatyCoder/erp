import { Body, Controller, Post } from '@nestjs/common';

@Controller('production')
export class ProductionController {
  @Post('sessions/start')
  startSession(@Body() dto: { tenantId: string; lineId: string; actorUserId: string }) {
    return { id: 'session-1', startedAt: new Date().toISOString(), ...dto };
  }

  @Post('sessions/end')
  endSession(@Body() dto: { tenantId: string; sessionId: string }) {
    return { ...dto, endedAt: new Date().toISOString() };
  }

  @Post('consume')
  consumeLot(@Body() dto: { tenantId: string; sessionId: string; lotId: string; netKg?: number }) {
    return { id: 'consumption-1', ...dto };
  }

  @Post('output')
  produceFinishedLot(@Body() dto: { tenantId: string; sessionId: string; lotCode: string; producedColli: number }) {
    return { id: 'output-1', ...dto };
  }

  @Post('scrap')
  recordScrap(@Body() dto: { tenantId: string; sessionId: string; reason: string; netKg: number }) {
    return { id: 'scrap-1', ...dto };
  }
}
