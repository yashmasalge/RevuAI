export async function fetchGitHubFile(url: string): Promise<string> {
  try {
    // If it's a file URL, fetch the file
    if (url.includes('/blob/')) {
      const rawUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
      const res = await fetch(rawUrl);
      if (!res.ok) throw new Error('Failed to fetch file');
      return await res.text();
    }
    // If it's a repo URL, fetch the main README as a sample (or return error)
    const match = url.match(/^https:\/\/github.com\/([^/]+)\/([^/]+)(?:\/|$)/);
    if (match) {
      const user = match[1];
      const repo = match[2];
      const readmeUrl = `https://raw.githubusercontent.com/${user}/${repo}/main/README.md`;
      const res = await fetch(readmeUrl);
      if (!res.ok) throw new Error('Failed to fetch README from repo');
      return await res.text();
    }
    throw new Error('Invalid GitHub URL');
  } catch {
    return '';
  }
}