import { ApiProperty } from '@nestjs/swagger';
import { RepoType } from 'src/enum/repoType.enum';

export class CreateRepoVO {
  @ApiProperty({
    description: '仓库名',
  })
  repoName: string;

  @ApiProperty({
    description: '仓库描述',
  })
  description: string;

  @ApiProperty({
    description: '仓库类型 0 public, 1 private',
    default: RepoType.PUBLIC,
  })
  type: RepoType = RepoType.PUBLIC;

  constructor() {
    this.repoName = '';
    this.description = '';
    this.type = RepoType.PUBLIC;
  }
}
