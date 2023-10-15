import { ApiProperty } from '@nestjs/swagger';

export class GetBranchPageListDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  repoId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  commitHash: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
