import { Inject, Injectable } from '@nestjs/common';
import { UserMapper } from 'src/mapper/user.mapper';
import { LoginDTO } from 'src/models/dto/login.dto';
import { HttpOKException } from 'src/utils/Exception';
import { sign } from 'src/utils/jwt';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserMapper.name) private readonly userMapper: typeof UserMapper,
  ) {}

  public async login(username: string, password: string) {
    const user = await this.userMapper.findOne({
      where: {
        username,
        password: Buffer.from(password, 'utf-8').toString('base64'),
      },
    });
    if (!user) {
      throw new HttpOKException('用户名或密码错误');
    }
    const dto = new LoginDTO();
    dto.token = sign({ id: user.id });
    return dto;
  }

  public async registry(username: string, password: string) {
    await this.userMapper.create({
      username,
      password: Buffer.from(password, 'utf-8').toString('base64'),
      nickname: username,
    });
  }
}
