import awesomeList from "./awesomeRepoList";

export const store = {
  set: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "QuotaExceededError"
      ) {
        //TODO: Preserve custome css and bookmark data
        localStorage.clear();
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          //TODO: Notify user to delete some bookmark or custome css
          console.error(error);
        }
      }
    }
  },
  get: (key: string) => localStorage.getItem(key),
};

export type fetchedList = {
  repoName: string;
  description: string;
  url: string;
};

export function getCachedList(
  userName: string,
  repoName: string,
) {
  const cacheData = store.get(`${userName}${repoName}-data`);
  if (!cacheData) return;
  return parseReadme(userName, repoName, cacheData);
}

export async function getFetchedList(
  userName: string,
  repoName: string,
  branchName: string,
): Promise<fetchedList[] | undefined> {
  const cacheEtag = store.get(`${userName}${repoName}-etag`);
  const cacheData = store.get(`${userName}${repoName}-data`);

  const githubRawUrl =
    `https://api.github.com/repos/${userName}/${repoName}/contents/README.md?ref=${branchName}`;

  const headers = new Headers();
  if (cacheEtag) {
    headers.append("If-None-Match", cacheEtag);
  }

  const response = await fetch(githubRawUrl, {
    headers,
  });

  if (response.status === 304 && cacheData) {
    return;
  }

  const etag = response.headers.get("ETag");
  if (etag) store.set(`${userName}${repoName}-etag`, etag);

  const resJson = await response.json();

  const readmeRes = await fetch(resJson.download_url);
  const readme = await readmeRes.text();

  store.set(`${userName}${repoName}-data`, readme);

  const fetchedList = parseReadme(userName, repoName, readme);
  return fetchedList;
}

const parseReadme = (
  userName: string,
  repoName: string,
  readme: string,
): fetchedList[] => {
  const regex =
    awesomeList.find((resource) =>
      resource.repoName === repoName && resource.userName === userName
    ).parserRegex;

  const result: fetchedList[] = [];
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
