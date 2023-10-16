import { ApiProperty } from '@nestjs/swagger';
import { RepoType } from 'src/enum/repoType.enum';

export class GetRepoPageListDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  branchNum: number;

  @ApiProperty()
  tagNum: number;

  @ApiProperty()
  issueNum: number;

  @ApiProperty()
  pullRequestNum: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: RepoType;

  @ApiProperty()
  description: string;

  @ApiProperty()
  defaultBranchName: string; // 第一次提交赋值

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  username: string;

  constructor() {
    this.branchNum = null;
    this.createdAt = null;
    this.defaultBranchName = null;
    this.description = null;
    this.id = null;
    this.issueNum = null;
    this.name = null;
    this.pullRequestNum = null;
    this.tagNum = null;
    this.type = null;
    this.updatedAt = null;
    this.userId = null;
    this.username = '';
  }
}
