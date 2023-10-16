import { ApiProperty } from '@nestjs/swagger';

export class GetCatFileDTO {
  @ApiProperty()
  text: string;

  @ApiProperty()
  size: number;
}
