import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PageVO } from 'src/models/page.vo';

export class GetRecommendRepoPageListVO extends PartialType(PageVO) {
  @ApiProperty()
  repoName: string;

  @ApiProperty()
  username: string;

  constructor() {
    super();
    this.repoName = this.username = '';
  }
}
