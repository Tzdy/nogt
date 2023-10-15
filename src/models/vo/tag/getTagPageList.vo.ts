import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PageVO } from 'src/models/page.vo';

export class GetTagPageListVO extends PartialType(PageVO) {
  @ApiProperty()
  username: string;

  @ApiProperty()
  repoName: string;

  @ApiProperty()
  tagName: string;
}
