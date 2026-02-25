import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, RefreshDto } from './dto';

@Controller('auth')
export class IdentityController {
  @Post('login')
  login(@Body() payload: LoginDto) {
    return {
      accessToken: `access-${payload.email}`,
      refreshToken: `refresh-${payload.email}`,
      roles: ['admin'],
      tenantId: 'tenant-demo'
    };
  }

  @Post('refresh')
  refresh(@Body() payload: RefreshDto) {
    return { accessToken: `access-from-${payload.refreshToken}` };
  }
}
