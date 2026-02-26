import { Controller, Get, Query } from '@nestjs/common';
import { DemoStoreService } from '../../../core/src/shared/demo-store.service';

@Controller('reporting/traceability')
export class ReportingController {
  constructor(private readonly store: DemoStoreService) {}

  @Get('forward')
  traceForward(@Query('tenantId') tenantId: string, @Query('lotCode') lotCode: string) {
    const lot = this.store.lots.find((x) => x.tenantId === tenantId && x.lotCode === lotCode);
    if (!lot) return { tenantId, lotCode, shipments: [] };

    const pallets = this.store.pallets.filter((p) => p.tenantId === tenantId && p.lotIds.includes(lot.id));
    const shipments = this.store.shipments.filter((s) => s.tenantId === tenantId && s.palletIds.some((pid) => pallets.some((p) => p.id === pid)));
    return { tenantId, lotCode, lotStatus: lot.status, pallets, shipments };
  }

  @Get('backward')
  traceBackward(@Query('tenantId') tenantId: string, @Query('shipmentId') shipmentId: string) {
    const shipment = this.store.shipments.find((x) => x.tenantId === tenantId && x.id === shipmentId);
    if (!shipment) return { tenantId, shipmentId, lots: [] };

    const pallets = this.store.pallets.filter((p) => p.tenantId === tenantId && shipment.palletIds.includes(p.id));
    const lots = this.store.lots.filter((l) => pallets.some((p) => p.lotIds.includes(l.id)));
    return { tenantId, shipmentId, pallets, lots };
  }
}
