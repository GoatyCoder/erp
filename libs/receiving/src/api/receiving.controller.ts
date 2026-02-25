import { Body, Controller, Post } from '@nestjs/common';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ReceivingService } from '../app/receiving.service';

class CreateInboundLotDto {
  @IsString()
  tenantId!: string;

  @IsString()
  actorUserId!: string;

  @IsString()
  lotCode!: string;

  @IsOptional()
  @IsString()
  productId?: string;
}

class RecordWeightDto {
  @IsString()
  tenantId!: string;

  @IsString()
  actorUserId!: string;

  @IsString()
  lotId!: string;

  @IsNumber()
  grossKg!: number;

  @IsOptional()
  @IsNumber()
  tareKg?: number;
}

@Controller('receiving')
export class ReceivingController {
  constructor(private readonly service: ReceivingService) {}

  @Post('inbound-lots')
  createInboundLot(@Body() dto: CreateInboundLotDto) {
    return this.service.createInboundLot(dto);
  }

  @Post('weights')
  recordWeight(@Body() dto: RecordWeightDto) {
    return { ...dto, netKg: dto.grossKg - (dto.tareKg ?? 0) };
  }

  @Post('attachments')
  attachDoc(@Body() payload: { tenantId: string; ownerId: string; filename: string }) {
    return { id: 'att-1', ...payload };
  }
}
