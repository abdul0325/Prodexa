export interface NormalizedPushEvent {
  type: 'PUSH';

  repository: {
    id: number;
    name: string;
    fullName: string;
  };

  author: {
    login: string;
    avatarUrl?: string;
  };

  branch: string;

  commits: {
    sha: string;
    message: string;
    timestamp: string;
    url: string;
  }[];

  pushedAt: string;
}