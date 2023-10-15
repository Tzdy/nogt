import { ApiProperty } from '@nestjs/swagger';

export class PageVO {
  @ApiProperty({
    description: '页码',
  })
  page: number;

  @ApiProperty()
  pageSize: number;

  constructor() {
    this.page = 1;
    this.pageSize = 10;
  }
}
