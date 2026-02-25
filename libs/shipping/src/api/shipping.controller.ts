import { Body, Controller, Post } from '@nestjs/common';

@Controller('shipping')
export class ShippingController {
  @Post('shipments')
  createShipment(@Body() dto: { tenantId: string; customerPartyId: string; siteId: string }) {
    return { id: 'shipment-1', status: 'PLANNED', ...dto };
  }

  @Post('shipments/assign-pallets')
  assignPallets(@Body() dto: { tenantId: string; shipmentId: string; palletIds: string[] }) {
    return { ...dto, assigned: dto.palletIds.length };
  }

  @Post('shipments/dispatch')
  dispatch(@Body() dto: { tenantId: string; shipmentId: string; docNo: string }) {
    return { ...dto, dispatchedAt: new Date().toISOString() };
  }
}
