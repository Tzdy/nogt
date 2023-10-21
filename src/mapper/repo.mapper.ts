import { Mapper, Select } from 'src/decorator/mapper.decorator';
import { GetRepoPageListDTO } from 'src/models/dto/repo/getRepoPageList.dto';
import { GetRepoPageListVO } from 'src/models/vo/repo/getRepoPageList.vo';
import { GetRecommendRepoPageListVO } from 'src/models/vo/repo/getRecommendRepoPageList.vo';
import { TRepo } from 'src/entity/init-models';

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
}
