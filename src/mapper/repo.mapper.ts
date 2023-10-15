import { Mapper, Select } from 'src/decorator/mapper.decorator';
import { GetRepoPageListDTO } from 'src/models/dto/repo/getRepoPageList.dto';
import { GetRepoPageListVO } from 'src/models/vo/repo/getRepoPageList.vo';
import { GetRecommendRepoPageListVO } from 'src/models/vo/repo/getRecommendRepoPageList.vo';
import { TRepo, TRepoCommit } from 'src/entity/init-models';
import { GetLatestCommitVO } from 'src/models/vo/repo/get_latest_commit.vo';
import { GetRepoOneDTO } from 'src/models/dto/repo/get_repo_one.dto';
import { GetRepoOneVO } from 'src/models/vo/repo/getRepoOne.vo';
@Mapper
export class RepoMapper extends TRepo {
  @Select(GetRepoPageListDTO)
  static getRepoPageList(vo: GetRepoPageListVO): Promise<GetRepoPageListDTO[]> {
    return null;
  }

  @Select(GetRepoPageListDTO)
  static getRecommendRepoPageList(
    vo: GetRecommendRepoPageListVO,
  ): Promise<GetRepoPageListDTO[]> {
    return null;
  }

  @Select(TRepoCommit)
  static getLatestCommit(vo: GetLatestCommitVO): Promise<TRepoCommit[]> {
    return null;
  }
}
