import { Controller, Get, Query } from '@nestjs/common';

@Controller('reporting/traceability')
export class ReportingController {
  @Get('forward')
  traceForward(@Query('tenantId') tenantId: string, @Query('lotCode') lotCode: string) {
    return {
      tenantId,
      lotCode,
      shipments: [{ shipmentId: 'shipment-1', pallets: ['SSCC123'] }]
    };
  }

  @Get('backward')
  traceBackward(@Query('tenantId') tenantId: string, @Query('shipmentId') shipmentId: string) {
    return {
      tenantId,
      shipmentId,
      lots: [{ lotCode: 'LOT-A', origin: 'inbound' }]
    };
  }
}
