export interface ApprovePROptions {
  owner: string;
  repo: string;
  prNumber: number;
  token: string;
  body?: string;
}
