import { ApiProperty } from '@nestjs/swagger';

export class CreateBranchVO {
  @ApiProperty()
  repoId: number;

  @ApiProperty()
  oldBranchId: number;

  @ApiProperty()
  newBranch: string;
}
