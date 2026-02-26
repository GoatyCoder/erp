import { Injectable } from '@nestjs/common';

export interface InboundPalletWeight {
  id: string;
  tenantId: string;
  lotId: string;
  palletCode: string;
  grossKg: number;
  tareKg: number;
  netKg: number;
  weighedAt: string;
}

export interface DemoLot {
  id: string;
  tenantId: string;
  lotCode: string;
  productId?: string;
  grossKg?: number;
  tareKg?: number;
  netKg?: number;
  weighedAt?: string;
  palletCount?: number;
  status: 'RECEIVED' | 'ON_HOLD' | 'RELEASED' | 'CONSUMED' | 'SHIPPED';
}

@Injectable()
export class DemoStoreService {
  lots: DemoLot[] = [];
  inboundPalletWeights: InboundPalletWeight[] = [];
  pallets: { id: string; tenantId: string; sscc: string; lotIds: string[]; status: 'OPEN' | 'CLOSED' }[] = [];
  shipments: { id: string; tenantId: string; palletIds: string[]; status: 'PLANNED' | 'DISPATCHED' }[] = [];
}
