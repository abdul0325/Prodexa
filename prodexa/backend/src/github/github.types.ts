export interface GitHubCommit {
  sha: string;
  author?: { login: string };
  commit?: { message: string };
}

export interface GitHubPull {
  id: number;
  user?: { login: string };
  state: string;
}

export interface GitHubIssue {
  id: number;
  user?: { login: string };
  state: string;
}
