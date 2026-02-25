import { Controller, Get, Query } from '@nestjs/common';

@Controller('inventory')
export class InventoryController {
  @Get('availability')
  availability(@Query('tenantId') tenantId: string) {
    return { tenantId, enabled: false, note: 'Module is optional and disabled by default.' };
  }
}
