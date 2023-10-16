import { ApiProperty } from '@nestjs/swagger';

export class GetLatestCommitByPathVO {
  @ApiProperty()
  username: string;

  @ApiProperty({
    description: '仓库名',
  })
  repoName: string;

  @ApiProperty()
  branch?: string;

  @ApiProperty()
  path?: string;
}
