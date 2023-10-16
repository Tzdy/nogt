export class GetTreeCommitListVO {
  list: { blobHash: string; path: string }[];
  repoId: number;
  branchId: number;
}
