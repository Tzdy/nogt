import { ApiProperty, PartialType } from '@nestjs/swagger';
import { RepoType } from 'src/enum/repoType.enum';
import { PageVO } from 'src/models/page.vo';

export class GetRepoPageListVO extends PartialType(PageVO) {
  repoName: string;

  username: string;

  userId: number;

  type: RepoType;
}
