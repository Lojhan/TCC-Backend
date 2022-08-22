import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FirebaseUser } from '../models/user.model';

export const User = createParamDecorator(
  (_data, ctx: ExecutionContext): FirebaseUser => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
