import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/decorator/user.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { LoginDTO } from 'src/models/dto/login.dto';
import { UserDTO } from 'src/models/dto/user.dto';
import { UserService } from 'src/service/user.service';
import { R } from 'src/utils/R';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login(
    @Query('username') username: string,
    @Query('password') password: string,
  ) {
    return R.OK<LoginDTO>(await this.userService.login(username, password));
  }

  @Post('/registry')
  async registry(
    @Query('username') username: string,
    @Query('password') password: string,
  ) {
    return await this.userService.registry(username, password);
  }

  @Get('/info')
  @UseGuards(AuthGuard)
  async info(@User() user: UserDTO) {
    return R.OK(user);
  }
}
