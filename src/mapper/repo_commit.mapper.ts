import { Mapper, Select } from 'src/decorator/mapper.decorator';
import { TRepoCommit } from 'src/entity/init-models';
import { GetRepoCommitPageListDTO } from 'src/models/dto/repo/getRepoCommitPageList.dto';
import { GetRepoCommitPageListVO } from 'src/models/vo/repo/getRepoCommitPageList.vo';
import { GetCommitByBranchAndRepoVO } from 'src/models/vo/repo_commit/getCommitByBranchAndRepo.vo';
@Mapper
export class RepoCommitMapper extends TRepoCommit {
  @Select(GetRepoCommitPageListDTO)
  static getRepoCommitPageList(
    vo: GetRepoCommitPageListVO,
  ): Promise<GetRepoCommitPageListDTO[]> {
    return null;
  }

  @Select(TRepoCommit)
  static getCommitByBranchAndRepo(
    vo: GetCommitByBranchAndRepoVO,
  ): Promise<TRepoCommit[]> {
    return null;
  }
}
