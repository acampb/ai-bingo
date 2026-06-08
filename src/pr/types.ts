export interface ApprovePROptions {
  owner: string;
  repo: string;
  prNumber: number;
  token: string;
  body?: string;
}

export interface ReviewResult {
  success: boolean;
  reviewId?: number;
  error?: string;
