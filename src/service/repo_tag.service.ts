import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { RepoType } from 'src/enum/repoType.enum';
import { RepoMapper } from 'src/mapper/repo.mapper';
import { UserMapper } from 'src/mapper/user.mapper';
import { PageDTO } from 'src/models/dto/page.dto';
import { UserDTO } from 'src/models/dto/user.dto';
import { GetTagPageListVO } from 'src/models/vo/tag/getTagPageList.vo';
import { HttpOKException } from 'src/utils/Exception';
import { PageUtil } from 'src/utils/PageUtil';
import { BaseService } from './base.service';
import { RepoTagMapper } from 'src/mapper/repo_tag.mapper';

@Injectable()
export class TagService {
  constructor(
    private readonly baseService: BaseService,
    @Inject(RepoTagMapper.name)
    private readonly repoTagMapper: typeof RepoTagMapper,
    @Inject(RepoMapper.name) private readonly repoMapper: typeof RepoMapper,
    @Inject(UserMapper.name) private readonly userMapper: typeof UserMapper,
  ) {}

  public async getTagPageList(vo: GetTagPageListVO, user?: UserDTO) {
    const { isMySelf, repo } = await this.baseService.getRepoInfo(
      vo.username,
      vo.repoName,
      user,
    );
    if (repo.type === RepoType.PRIVATE && !isMySelf) {
      throw new HttpOKException('没有权限查看');
    }
    const { rows: repoList, count: total } =
      await this.repoTagMapper.findAndCountAll({
        where: {
          repoId: repo.id,
          name: {
            [Op.like]: `${vo.tagName}%`,
          },
        },
        ...PageUtil.page(vo),
      });
    return new PageDTO(repoList, total);
  }

  // public async deleteTag() {}
}
