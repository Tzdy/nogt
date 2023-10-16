import { ApiProperty } from '@nestjs/swagger';

export class GetRepoCommitPageListDTO {
  @ApiProperty()
  username: string; // 提交者名称

  @ApiProperty()
  commitTime: Date; // 提交时间

  @ApiProperty()
  commitHash: string;

  @ApiProperty()
  comment: string;

  @ApiProperty({
    description: '是否是用户',
  })
  isUser: boolean;

  constructor() {
    this.username = '';
    this.commitTime = null;
    this.commitHash = '';
    this.comment = '';
    this.isUser = null;
  }
}
