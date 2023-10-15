import { Mapper, Select } from 'src/decorator/mapper.decorator';
import { TBranch, TRepoCommit } from 'src/entity/init-models';
@Mapper
export class BranchMapper extends TBranch {}
