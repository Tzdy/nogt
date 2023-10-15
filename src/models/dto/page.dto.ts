import { ApiProperty } from '@nestjs/swagger';

export class PageDTO<T> {
  constructor(list: Array<T>, total: number) {
    this.list = list;
    this.total = total;
  }

  @ApiProperty()
  list: Array<T>;
  @ApiProperty()
  total: number;
}
