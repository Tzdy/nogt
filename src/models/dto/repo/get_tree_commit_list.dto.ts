export class GetTreeCommitListDTO {
  blobHash: string;

  path: string;

  commitHash: string;

  comment: string;

  username: string;

  commitTime: Date;

  constructor() {
    this.blobHash = null;
    this.path = null;
    this.comment = null;
    this.commitHash = null;
    this.username = null;
    this.commitTime = null;
  }
}
