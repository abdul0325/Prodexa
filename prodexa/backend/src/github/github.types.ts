export interface GitHubCommit {
  sha: string;
  author?: {
    login: string;
  };
  commit?: {
    author?: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
}

export interface GitHubPull {
  id: number;
  number: number;
  title: string;
  state: string;
  user?: {
    login: string;
  };
  merged_at?: string | null;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: string;
  user?: {
    login: string;
  };
  pull_request?: {       // ← this field exists on issues that are PRs
    url: string;
    merged_at?: string;
  };
}