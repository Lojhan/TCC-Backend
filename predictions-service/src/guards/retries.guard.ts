import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RetriesGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { retries } = request.headers;

    if (retries && Number(retries) > 3) {
      request.res.status(400).send('Too many retries');
      return false;
    }
    return true;
  }
}
