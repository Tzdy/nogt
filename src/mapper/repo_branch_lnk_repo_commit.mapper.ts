import { Mapper } from 'src/decorator/mapper.decorator';
import { TRepoBranchLnkRepoCommit } from 'src/entity/init-models';
import { CopyBranchLnkVO } from 'src/models/vo/repo_branch_lnk_repo_commit/copy_branch_lnk.vo';
@Mapper
export class RepoBranchLnkRepoCommitMapper extends TRepoBranchLnkRepoCommit {
  static async copyBranchLnk(vo: CopyBranchLnkVO): Promise<void> {
    return null;
  }
}
