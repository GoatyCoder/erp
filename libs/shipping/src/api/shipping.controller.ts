import { Body, Controller, Post } from '@nestjs/common';
import { DemoStoreService } from '../../../core/src/shared/demo-store.service';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly store: DemoStoreService) {}

  @Post('shipments')
  createShipment(@Body() dto: { tenantId: string; customerPartyId: string; siteId: string }) {
    const shipment = { id: 'shipment-' + Date.now(), palletIds: [], status: 'PLANNED' as const, ...dto };
    this.store.shipments.push(shipment);
    return shipment;
  }

  @Post('shipments/assign-pallets')
  assignPallets(@Body() dto: { tenantId: string; shipmentId: string; palletIds: string[] }) {
    const shipment = this.store.shipments.find((x) => x.id === dto.shipmentId && x.tenantId === dto.tenantId);
    if (shipment) shipment.palletIds = [...new Set([...shipment.palletIds, ...dto.palletIds])];
    return shipment ?? { error: 'Shipment not found' };
  }

  @Post('shipments/dispatch')
  dispatch(@Body() dto: { tenantId: string; shipmentId: string; docNo: string }) {
    const shipment = this.store.shipments.find((x) => x.id === dto.shipmentId && x.tenantId === dto.tenantId);
    if (!shipment) return { error: 'Shipment not found' };
    shipment.status = 'DISPATCHED';

    const pallets = this.store.pallets.filter((p) => shipment.palletIds.includes(p.id));
    for (const pallet of pallets) {
      for (const lotId of pallet.lotIds) {
        const lot = this.store.lots.find((l) => l.id === lotId && l.tenantId === dto.tenantId);
        if (lot) lot.status = 'SHIPPED';
      }
    }

    return { ...shipment, docNo: dto.docNo, dispatchedAt: new Date().toISOString() };
  }
}
