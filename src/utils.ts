export type fetchedList = {
  repoName: string;
  description: string;
  url: string;
};

export async function getFetchedList(
  userName: string,
  repoName: string,
  branchName: string
): Promise<fetchedList[]> {
  const cacheEtag = localStorage.getItem(`${userName}${repoName}-etag`);
  const cacheData = localStorage.getItem(`${userName}${repoName}-data`);

  const githubRawUrl = `https://api.github.com/repos/${userName}/${repoName}/contents/README.md?ref=${branchName}`;

  const headers = new Headers();
  if (cacheEtag) {
    headers.append("If-None-Match", cacheEtag);
  }

  const response = await fetch(githubRawUrl, {
    headers,
  });

  if (response.status === 304 && cacheData) {
    return parseReadme(`${userName}/${repoName}`, cacheData);
  }

  const etag = response.headers.get("ETag");
  if (etag) localStorage.setItem(`${userName}${repoName}-etag`, etag);

  const resJson = await response.json();

  const readmeRes = await fetch(resJson.download_url);
  const readme = await readmeRes.text();

  localStorage.setItem(`${userName}${repoName}-data`, readme);

  const parser = parsers[`${userName}${repoName}`];
  if (!parser) return defaultParser(readme);
  const fetchedList = parseReadme(`${userName}/${repoName}`, readme);
  return fetchedList;
}

function parseReadme(parserName = "default", readme: string) {
  const parser = parsers[parserName];
  if (!parser) {
    console.log("Using default parser for ", parserName);
    return defaultParser(readme);
  }
  console.log("Found parser for ", parserName);
  return parser(readme);
}

type readmeParser = (readme: string) => fetchedList[];

const defaultParser: readmeParser = (readme) => {
  const regex = /- \[([^\]]+)\]\((https:\/\/github\.com\/[^\)]+)\) (.+)/;

  const result = [];
  readme.split("\n").forEach((line) => {
    const match = line.match(regex);
    if (match) {
      result.push({
        repoName: match[1],
        url: match[2],
        description: match[3],
      });
    }
  });

  return result;
};

const jaywcjloveAwesomeMac: readmeParser = (readme) => {
  const regex = /\* \[([^\]]+)\]\(([^)]+)\) - (.+?)(?:[ ]+\[|\n|$)/;
  const result = [];
  readme.split("\n").forEach((line) => {
    const match = line.match(regex);
    if (match) {
      result.push({
        repoName: match[1],
        url: match[2],
        description: match[3],
      });
    }
  });
  return result;
};

// Repo specific README.md parsers
const parsers: { [key: string]: readmeParser } = {
  "jaywcjlove/awesome-mac": jaywcjloveAwesomeMac,
};
