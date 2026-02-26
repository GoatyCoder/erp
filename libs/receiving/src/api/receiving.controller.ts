import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ReceivingService } from '../app/receiving.service';
import { DemoStoreService, InboundPalletWeight } from '../../../core/src/shared/demo-store.service';

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
  @IsOptional() @IsString() palletCode?: string;
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

  @Get('weights')
  listWeights(@Query('tenantId') tenantId: string, @Query('lotId') lotId?: string) {
    return this.store.inboundPalletWeights.filter((x) => x.tenantId === tenantId && (!lotId || x.lotId === lotId));
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

    const lot = this.store.lots.find((x) => x.id === dto.lotId && x.tenantId === dto.tenantId);
    if (!lot) {
      throw new BadRequestException('lot not found for tenant');
    }

    const palletCode = dto.palletCode?.trim() || `PED-${(lot.palletCount ?? 0) + 1}`;
    const duplicatePallet = this.store.inboundPalletWeights.find(
      (x) => x.tenantId === dto.tenantId && x.lotId === dto.lotId && x.palletCode === palletCode
    );
    if (duplicatePallet) {
      throw new BadRequestException('palletCode already used for this lot');
    }

    const weightRecord = await this.service.recordInboundWeight({ ...dto, tareKg, palletCode });
    const palletWeight: InboundPalletWeight = {
      id: `${dto.lotId}-${palletCode}`,
      tenantId: dto.tenantId,
      lotId: dto.lotId,
      palletCode,
      grossKg: weightRecord.grossKg,
      tareKg: weightRecord.tareKg,
      netKg: weightRecord.netKg,
      weighedAt: weightRecord.weighedAt
    };

    this.store.inboundPalletWeights.push(palletWeight);

    const lotWeights = this.store.inboundPalletWeights.filter((x) => x.tenantId === dto.tenantId && x.lotId === dto.lotId);
    lot.palletCount = lotWeights.length;
    lot.grossKg = lotWeights.reduce((sum, x) => sum + x.grossKg, 0);
    lot.tareKg = lotWeights.reduce((sum, x) => sum + x.tareKg, 0);
    lot.netKg = lotWeights.reduce((sum, x) => sum + x.netKg, 0);
    lot.weighedAt = weightRecord.weighedAt;

    return { ...weightRecord, lotTotals: { palletCount: lot.palletCount, grossKg: lot.grossKg, tareKg: lot.tareKg, netKg: lot.netKg } };
  }
}
