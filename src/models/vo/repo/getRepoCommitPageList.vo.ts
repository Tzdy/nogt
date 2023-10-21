import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PageVO } from 'src/models/page.vo';

export class GetRepoCommitPageListVO extends PartialType(PageVO) {
  @ApiProperty()
  username: string;

  @ApiProperty()
  repoName: string;

  @ApiProperty()
  branch?: string;

  @ApiProperty()
  path?: string;

  @ApiProperty()
  commitUsername?: string;

  @ApiProperty()
  commitHash?: string;
}
