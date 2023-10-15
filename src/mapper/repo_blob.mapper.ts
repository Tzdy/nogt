import { Mapper, Select } from 'src/decorator/mapper.decorator';
import { TRepoBlob } from 'src/entity/init-models';
import { GetTreeCommitListDTO } from 'src/models/dto/repo/get_tree_commit_list.dto';
import { GetTreeCommitListVO } from 'src/models/vo/repo/get_tree_commit_list.vo';
@Mapper
export class RepoBlobMapper extends TRepoBlob {
  @Select(GetTreeCommitListDTO)
  static getTreeCommitList(
    vo: GetTreeCommitListVO,
  ): Promise<GetTreeCommitListDTO[]> {
    return null;
  }
}
