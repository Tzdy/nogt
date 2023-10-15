import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PageVO } from 'src/models/page.vo';

export class GetBranchPageListVO extends PartialType(PageVO) {
  @ApiProperty()
  username: string;

  @ApiProperty()
  repoName: string;

  @ApiProperty()
  branchName: string;
}
