import { ApiProperty } from '@nestjs/swagger';

export class GetLsTreeDTO {
  @ApiProperty()
  type: 'blob' | 'tree';

  @ApiProperty()
  hash: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  commitHash: string;

  @ApiProperty()
  commitContent: string;

  @ApiProperty()
  commitUser: string;

  @ApiProperty()
  commitTime: Date;

  constructor() {
    this.type = null;
    this.hash = null;
    this.name = null;
    this.path = null;
    this.commitContent = null;
    this.commitHash = null;
    this.commitUser = null;
    this.commitTime = null;
  }
}
