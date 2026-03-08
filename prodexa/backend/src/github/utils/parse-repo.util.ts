export function parseRepoUrl(repoUrl: string) {
  const parts = repoUrl.split("github.com/")[1].split("/");
  return {
    owner: parts[0],
    repo: parts[1],
  };
}