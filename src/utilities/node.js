export async function getLatestNodeMajorVersion() {
  let response = await fetch("https://nodejs.org/dist/index.json");
  let releases = await response.json();
  return Number.parseInt(releases[0].version.replace(/^v/, ""), 10);
}
