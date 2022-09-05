import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class FirebaseTokenGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const { authorization } = request.headers;

      const [type, token] = authorization?.split(' ');

      if (!token) return this.userNotAuthenticated('token error - no token');
      if (typeof token !== 'string')
        return this.userNotAuthenticated('token error - malformed token');
      if (type !== 'Bearer')
        return this.userNotAuthenticated('token error - wrong token type');
      if (token.length < 1)
        return this.userNotAuthenticated('token error - malformed token');

      const decodedToken = await this.firebaseService.validateToken(token);
      if (!decodedToken)
        return this.userNotAuthenticated('token error - firebase token error');

      if (decodedToken.exp < Date.now() / 1000)
        return this.userNotAuthenticated('token error - token expired');

      context.switchToHttp().getRequest().user = decodedToken;
      console.log(`[USER AUTHENTICATED] - ${decodedToken.email}`);
      return true;
    } catch (e) {
      return this.userNotAuthenticated('exception');
    }
  }

  userNotAuthenticated(email: string): boolean {
    console.log(`[USER NOT AUTHENTICATED] - ${email}`);
    return false;
  }
}
