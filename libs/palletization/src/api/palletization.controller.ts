import { Body, Controller, Post } from '@nestjs/common';

@Controller('palletization')
export class PalletizationController {
  @Post('pallets')
  createPallet(@Body() dto: { tenantId: string; sscc: string }) {
    return { id: 'pallet-1', status: 'OPEN', ...dto };
  }

  @Post('pallets/add-cases')
  addCases(@Body() dto: { tenantId: string; palletId: string; handlingUnitIds: string[] }) {
    return { ...dto, count: dto.handlingUnitIds.length };
  }

  @Post('pallets/close')
  closePallet(@Body() dto: { tenantId: string; palletId: string }) {
    return { ...dto, status: 'CLOSED' };
  }

  @Post('pallets/print-label')
  printLabel(@Body() dto: { tenantId: string; palletId: string }) {
    return { ...dto, labelStub: '^XA...^XZ' };
  }
}
