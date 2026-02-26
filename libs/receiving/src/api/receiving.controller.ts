import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ReceivingService } from '../app/receiving.service';
import { DemoStoreService } from '../../../core/src/shared/demo-store.service';

class CreateInboundLotDto {
  @IsString() tenantId!: string;
  @IsString() actorUserId!: string;
  @IsString() lotCode!: string;
  @IsOptional() @IsString() productId?: string;
}

class RecordWeightDto {
  @IsString() tenantId!: string;
  @IsString() actorUserId!: string;
  @IsString() lotId!: string;
  @IsNumber() grossKg!: number;
  @IsOptional() @IsNumber() tareKg?: number;
}

@Controller('receiving')
export class ReceivingController {
  constructor(private readonly service: ReceivingService, private readonly store: DemoStoreService) {}

  @Post('inbound-lots')
  async createInboundLot(@Body() dto: CreateInboundLotDto) {
    const lot = await this.service.createInboundLot(dto);
    this.store.lots.push({ id: lot.id, tenantId: dto.tenantId, lotCode: dto.lotCode, productId: dto.productId, status: 'RECEIVED' });
    return lot;
  }

  @Get('inbound-lots')
  list(@Query('tenantId') tenantId: string) {
    return this.store.lots.filter((x) => x.tenantId === tenantId);
  }

  @Post('weights')
  recordWeight(@Body() dto: RecordWeightDto) {
    const netKg = dto.grossKg - (dto.tareKg ?? 0);
    const lot = this.store.lots.find((x) => x.id === dto.lotId && x.tenantId === dto.tenantId);
    if (lot) lot.netKg = netKg;
    return { ...dto, netKg };
  }
}
