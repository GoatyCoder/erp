import { Body, Controller, Post } from '@nestjs/common';
import { DemoStoreService } from '../../../core/src/shared/demo-store.service';

@Controller('palletization')
export class PalletizationController {
  constructor(private readonly store: DemoStoreService) {}

  @Post('pallets')
  createPallet(@Body() dto: { tenantId: string; sscc: string }) {
    const pallet = { id: 'pallet-' + Date.now(), tenantId: dto.tenantId, sscc: dto.sscc, lotIds: [], status: 'OPEN' as const };
    this.store.pallets.push(pallet);
    return pallet;
  }

  @Post('pallets/add-cases')
  addCases(@Body() dto: { tenantId: string; palletId: string; lotIds: string[] }) {
    const pallet = this.store.pallets.find((x) => x.id === dto.palletId && x.tenantId === dto.tenantId);
    if (pallet) pallet.lotIds = [...new Set([...pallet.lotIds, ...dto.lotIds])];
    return pallet ?? { error: 'Pallet not found' };
  }

  @Post('pallets/close')
  closePallet(@Body() dto: { tenantId: string; palletId: string }) {
    const pallet = this.store.pallets.find((x) => x.id === dto.palletId && x.tenantId === dto.tenantId);
    if (pallet) pallet.status = 'CLOSED';
    return pallet ?? { error: 'Pallet not found' };
  }
}
