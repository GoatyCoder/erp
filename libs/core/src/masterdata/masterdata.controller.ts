import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';

class ProductDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  gtin?: string;
}

class PackSpecDto {
  @IsString()
  productId!: string;

  @IsString()
  description!: string;
}

class PartyDto {
  @IsString()
  type!: string;

  @IsString()
  name!: string;
}

@Controller('masterdata')
export class MasterdataController {
  @Post('products')
  createProduct(@Body() dto: ProductDto) {
    return { id: `id-${Date.now()}`, ...dto };
  }

  @Get('products/:id')
  getProduct(@Param('id') id: string) {
    return { id, name: 'Sample Product' };
  }

  @Post('pack-specs')
  createPackSpec(@Body() dto: PackSpecDto) {
    return { id: `id-${Date.now()}`, ...dto };
  }

  @Post('parties')
  createParty(@Body() dto: PartyDto) {
    return { id: `id-${Date.now()}`, ...dto };
  }
}
