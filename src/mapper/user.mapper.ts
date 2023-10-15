import { Mapper } from 'src/decorator/mapper.decorator';
import { TUser } from 'src/entity/init-models';
@Mapper
export class UserMapper extends TUser {}
