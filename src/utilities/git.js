import { execa } from "execa";

export async function getGitHubUsername() {
  return (await execa("gh", ["api", "user", "-q", ".login"])).stdout || null;
}

export async function getGitUserName() {
  return (await execa("git", ["config", "user.name"])).stdout || null;
}

export async function getGitUserEmail() {
  return (await execa("git", ["config", "user.email"])).stdout || null;
}
