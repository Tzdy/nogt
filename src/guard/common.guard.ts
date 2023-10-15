import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { UserMapper } from 'src/mapper/user.mapper';
import { UserDTO } from 'src/models/dto/user.dto';
import { verify } from 'src/utils/jwt';

@Injectable()
export class CommonGuard implements CanActivate {
  constructor(
    @Inject(UserMapper.name)
    private readonly userMapper: typeof UserMapper,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;
    if (typeof authorization === 'string') {
      const jwtUser = verify(authorization);
      const user = await this.userMapper.findOne({
        attributes: ['id', 'username', 'nickname'],
        where: {
          id: jwtUser.id,
        },
      });
      if (user) {
        const userDTO = new UserDTO();
        Object.assign(userDTO, user.toJSON());
        request['user'] = userDTO;
      }
    }
    return true;
  }
}
