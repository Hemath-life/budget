import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // If there's an error from Google OAuth (e.g., user denied access), allow the request through
    // so the controller can handle it and redirect appropriately
    if (request.query.error) {
      return true;
    }

    const activate = (await super.canActivate(context)) as boolean;
    return activate;
  }
}
