import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
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
  async recordWeight(@Body() dto: RecordWeightDto) {
    const tareKg = dto.tareKg ?? 0;
    if (dto.grossKg <= 0) {
      throw new BadRequestException('grossKg must be greater than zero');
    }
    if (tareKg < 0) {
      throw new BadRequestException('tareKg cannot be negative');
    }
    if (tareKg > dto.grossKg) {
      throw new BadRequestException('tareKg cannot be greater than grossKg');
    }

    const weightRecord = await this.service.recordInboundWeight({ ...dto, tareKg });
    const lot = this.store.lots.find((x) => x.id === dto.lotId && x.tenantId === dto.tenantId);
    if (lot) {
      lot.grossKg = weightRecord.grossKg;
      lot.tareKg = weightRecord.tareKg;
      lot.netKg = weightRecord.netKg;
      lot.weighedAt = weightRecord.weighedAt;
    }

    return weightRecord;
  }
}
