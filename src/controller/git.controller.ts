import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Git, parseGitName } from 'node-git-server';
import { GitService } from 'src/service/git.service';
@Controller('/git')
export class GitController {
  git: Git;

  constructor(private readonly gitService: GitService) {
    const git = new Git('/Users/mac/Documents/web/server/gogs/nest/repo', {
      autoCreate: false,
      authenticate: ({ type, repo, user, ...a }, next) => {
        if (type === 'push' || type === 'tag') {
          console.log(a);
          user(async (username, password) => {
            if (username && password) {
              try {
                const pathArr = repo.split('/').filter((item) => item);
                const repoName = parseGitName(pathArr[pathArr.length - 1]);
                // const branchName = push.branch;
                // const last = push.last;
                await this.gitService.prePush(username, repoName);
                // await this.authService.login(username, password);
                next();
              } catch (err: any) {
                next(err.message);
              }
            } else {
              next(new Error('please input username and password'));
            }
          });
        } else {
          next();
        }
      },
    });
    this.git = git;
    git.on('tag', async (tag) => {
      tag.res.on('finish', async () => {
        await this.gitService.afterPushTag(
          tag.username,
          parseGitName(
            tag.repo
              .split('/')
              .filter((item) => item)
              .pop(),
          ),
          tag.version,
          tag.commit,
        );
      });
      tag.accept();
    });
    git.on('push', async (push) => {
      push.res.on('finish', async () => {
        await this.gitService.afterPush(
          push.username,
          parseGitName(
            push.repo
              .split('/')
              .filter((item) => item)
              .pop(),
          ),
          push.branch,
          push.commit,
        );
      });
      push.accept();
    });
    git.on('fetch', (fetch) => fetch.accept());
  }

  @Get('/*')
  handleGet(@Req() request: Request, @Res() response: Response) {
    request.url = request.url.replace(/^\/git/, '');
    this.git.handle(request, response);
  }

  @Post('/*')
  handlePost(@Req() request: Request, @Res() response: Response) {
    request.url = request.url.replace(/^\/git/, '');
    this.git.handle(request, response);
  }
}
