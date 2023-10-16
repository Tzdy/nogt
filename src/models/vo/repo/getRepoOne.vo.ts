import { ApiProperty } from '@nestjs/swagger';
import { RefType } from 'src/enum/ref_type.enum';

export class GetRepoOneVO {
  @ApiProperty()
  username: string;

  @ApiProperty()
  repoName: string;

  @ApiProperty()
  branch?: string;

  @ApiProperty()
  refType?: RefType;
}
