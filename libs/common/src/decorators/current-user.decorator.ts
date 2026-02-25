import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';

const getCurrentUserByContext = (ctx: ExecutionContext): UserDto => {
  return ctx.switchToHttp().getRequest().user as UserDto;
};

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => getCurrentUserByContext(ctx),
);
