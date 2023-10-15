import { ApiProperty } from '@nestjs/swagger';

export class GetCommitByBranchAndRepoVO {
  @ApiProperty()
  repoId: number;

  @ApiProperty()
  branchId: number;
}
