import { Inject, Injectable } from '@nestjs/common';
import { RepoType } from 'src/enum/repoType.enum';
import { RepoMapper } from 'src/mapper/repo.mapper';
import { UserMapper } from 'src/mapper/user.mapper';
import { UserDTO } from 'src/models/dto/user.dto';
import { HttpOKException } from 'src/utils/Exception';

@Injectable()
export class BaseService {
  constructor(
    @Inject(RepoMapper.name) private readonly repoMapper: typeof RepoMapper,
    @Inject(UserMapper.name) private readonly userMapper: typeof UserMapper,
  ) {}

  public async getRepoInfo(username: string, repoName: string, user?: UserDTO) {
    let isMySelf = false;
    const targetUser = await this.userMapper.findOne({
      where: {
        username: username,
      },
    });
    if (!targetUser) {
      throw new HttpOKException('该用户不存在', 20002);
    }
    if (user && user.id === targetUser.id) {
      isMySelf = true;
    }

    const repo = await this.repoMapper.findOne({
      where: {
        name: repoName,
        userId: targetUser.id,
      },
    });
    if (!repo) {
      throw new HttpOKException('仓库不存在');
    }
    if (!isMySelf && repo.type === RepoType.PRIVATE) {
      throw new HttpOKException('没有仓库访问权限');
    }

    return {
      targetUser,
      isMySelf,
      repo,
    };
  }
}
