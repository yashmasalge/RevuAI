import { fetchGitHubFile } from "../../lib/github";

export async function POST(req: Request) {
  const { url } = await req.json();
  const code = await fetchGitHubFile(url);
  return Response.json({ code });
}
