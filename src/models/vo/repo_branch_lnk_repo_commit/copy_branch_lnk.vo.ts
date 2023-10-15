import { ApiProperty } from '@nestjs/swagger';

export class CopyBranchLnkVO {
  @ApiProperty()
  oldBranchId: number;

  @ApiProperty()
  newBranchId: number;
}
