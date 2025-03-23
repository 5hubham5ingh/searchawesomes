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
    console.log("Cache Etag", cacheEtag);
    headers.append("If-None-Match", cacheEtag);
  }

  const response = await fetch(githubRawUrl, {
    headers,
  });

  if (response.status === 304 && cacheData) {
    return parsers[`${userName}${repoName}`](cacheData);
  }

  const etag = response.headers.get("ETag");
  if (etag) localStorage.setItem(`${userName}${repoName}-etag`, etag);

  const resJson = await response.json();

  const readmeRes = await fetch(resJson.download_url);
  const readme = await readmeRes.text();

  localStorage.setItem(`${userName}${repoName}-data`, readme);

  const fetchedList = parsers[`${userName}${repoName}`](readme);
  console.log(readme,fetchedList)
  return fetchedList;
}

const defaultParser = (readme) => {
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

const parsers: { [key: string]: (readme: string) => fetchedList[] } = {
  "rothgarawesome-tuis": defaultParser,
};
