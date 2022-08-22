import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class FirebaseTokenGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const [type, token] = request.headers.authorization?.split(' ');

      if (!token) return false;
      if (typeof token !== 'string') return false;
      if (type !== 'Bearer') return false;
      if (token.length < 1) return false;

      const decodedToken = await this.firebaseService.validateToken(token);
      if (!decodedToken) return false;

      if (decodedToken.exp < Date.now() / 1000 - 60 * 60) return false;

      context.switchToHttp().getRequest().user = decodedToken;
      return true;
    } catch {
      return false;
    }
  }
}
