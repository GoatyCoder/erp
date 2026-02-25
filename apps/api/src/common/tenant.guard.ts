import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined>; path?: string; url?: string }>();
    const path = request.path ?? request.url ?? '';

    if (path.startsWith('/auth') || path.startsWith('/api/health') || !path.startsWith('/')) {
      return true;
    }

    const tenantId = request.headers['x-tenant-id'];
    if (!tenantId) {
      throw new UnauthorizedException('Missing x-tenant-id header');
    }
    return true;
  }
}
