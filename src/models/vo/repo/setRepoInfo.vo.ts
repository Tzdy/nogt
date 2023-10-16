import { ApiProperty } from '@nestjs/swagger';
import { RepoType } from 'src/enum/repoType.enum';

export class SetRepoInfoVO {
  @ApiProperty({})
  repoId: number;

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
  })
  type: RepoType;
}
