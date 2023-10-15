import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  PickType,
} from '@nestjs/swagger';
import { ApiPageResponse } from 'src/decorator/apiPageResponse.decorator';
import { User } from 'src/decorator/user.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { CommonGuard } from 'src/guard/common.guard';
import { LoginDTO } from 'src/models/dto/login.dto';
import { PageDTO } from 'src/models/dto/page.dto';
import { GetLsTreeDTO } from 'src/models/dto/repo/get_ls_tree.dto';
import { GetBranchPageListDTO } from 'src/models/dto/repo_branch/get_branch_page_list.dto';
import { GetTagPageListDTO } from 'src/models/dto/tag/getTagPageList.dto';
import { UserDTO } from 'src/models/dto/user.dto';
import { CreateRepoVO } from 'src/models/vo/repo/createRepo.vo';
import { GetRecommendRepoPageListVO } from 'src/models/vo/repo/getRecommendRepoPageList.vo';
import { GetRepoCommitPageListVO } from 'src/models/vo/repo/getRepoCommitPageList.vo';
import { GetRepoOneVO } from 'src/models/vo/repo/getRepoOne.vo';
import { GetRepoPageListVO } from 'src/models/vo/repo/getRepoPageList.vo';
import { GetCatFileVO } from 'src/models/vo/repo/get_cat_file.vo';
import { GetLatestCommitByPathVO } from 'src/models/vo/repo/get_latest_commit_by_path.vo';
import { GetLsTreeVO } from 'src/models/vo/repo/get_ls_tree.vo';
import { SetRepoInfoVO } from 'src/models/vo/repo/setRepoInfo.vo';
import { CreateBranchVO } from 'src/models/vo/repo_branch/create_branch.vo';
import { GetBranchPageListVO } from 'src/models/vo/repo_branch/get_branch_page_list.vo';
import { GetTagPageListVO } from 'src/models/vo/tag/getTagPageList.vo';
import { RepoService } from 'src/service/repo.service';
import { RepoBranchService } from 'src/service/repo_branch.service';
import { TagService } from 'src/service/repo_tag.service';
import { UserService } from 'src/service/user.service';
import { R } from 'src/utils/R';

@Controller('/repo')
export class RepoController {
  constructor(
    private readonly userService: UserService,
    private readonly repoService: RepoService,
    private readonly tagService: TagService,
    private readonly branchService: RepoBranchService,
  ) {}

  @Get('/getRepoPageList')
  @UseGuards(CommonGuard)
  async info(@Query() vo: GetRepoPageListVO, @User() user?: UserDTO) {
    return R.OK(await this.repoService.getRepoPageList(vo, user));
  }

  @Get('/getRecommendRepoPageList')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getRecommendRepoPageList(@Query() vo: GetRecommendRepoPageListVO) {
    console.log(vo);
    return R.OK(await this.repoService.getRecommendRepoPageList(vo));
  }

  @Get('/getRepoOne')
  async getRepoOne(@Query() vo: GetRepoOneVO) {
    return R.OK(await this.repoService.getRepoOne(vo));
  }

  @Post('/createRepo')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  async createRepo(@Query() vo: CreateRepoVO, @User() user: UserDTO) {
    await this.repoService.createRepo(vo, user);
    return R.OK();
  }

  @Put('/setRepoInfo')
  @UseGuards(AuthGuard)
  async setRepoInfo(@Query() vo: SetRepoInfoVO, @User() user: UserDTO) {
    await this.repoService.setRepoInfo(vo, user);
    return R.OK();
  }

  @Delete('/deleteRepo')
  @UseGuards(AuthGuard)
  async deleteRepo(@Query('repoId') repoId: number, @User() user: UserDTO) {
    await this.repoService.deleteRepo(repoId, user);
    return R.OK();
  }

  @ApiOperation({ description: '获取标签列表' })
  @ApiPageResponse(GetTagPageListDTO)
  @Get('/getTagPageList')
  @UseGuards(CommonGuard)
  async getTagPageList(@Query() vo: GetTagPageListVO, @User() user?: UserDTO) {
    return R.OK(await this.tagService.getTagPageList(vo, user));
  }

  @ApiOperation({ description: '获取分支列表' })
  @ApiPageResponse(GetBranchPageListDTO)
  @Get('/getBranchPageList')
  @UseGuards(CommonGuard)
  async getBranchPageList(
    @Query() vo: GetBranchPageListVO,
    @User() user?: UserDTO,
  ) {
    return R.OK(await this.branchService.getBranchPageList(vo, user));
  }

  @Get('/getRepoCommitPageList')
  @UseGuards(CommonGuard)
  async getRepoCommitPageList(
    @Query() vo: GetRepoCommitPageListVO,
    @User() user?: UserDTO,
  ) {
    return R.OK(await this.repoService.getRepoCommitPageList(vo, user));
  }

  @Get('/getLatestCommitByPath')
  @UseGuards(CommonGuard)
  async getLatestCommitByPath(
    @Query() vo: GetLatestCommitByPathVO,
    @User() user?: UserDTO,
  ) {
    return R.OK(await this.repoService.getLatestCommitByPath(vo, user));
  }

  @Get('/getLsTree')
  @UseGuards(CommonGuard)
  async getLsTree(
    @Query() vo: GetLsTreeVO,
    @User() user?: UserDTO,
  ): Promise<R<GetLsTreeDTO[]>> {
    return R.OK(await this.repoService.getLsTree(vo, user));
  }

  @Get('/getCatFile')
  @UseGuards(CommonGuard)
  async getCatFile(@Query() vo: GetCatFileVO, @User() user?: UserDTO) {
    return R.OK(await this.repoService.getCatFile(vo, user));
  }

  @Post('/createBranch')
  @UseGuards(AuthGuard)
  async createBranch(@Query() vo: CreateBranchVO, @User() user: UserDTO) {
    await this.branchService.createBranch(vo, user);
    return R.OK();
  }
}
