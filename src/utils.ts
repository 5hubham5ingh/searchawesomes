export type fetchedList = {
  repoName: string;
  description: string;
  url: string;
};

const placeholderList: fetchedList[] = [
  {
    repoName: "placeholderList",
    description: `array.forEach(element => {
      
    })`,
    url: "placeholderList url",
  },
  {
    repoName: "placeholderList",
    description: `array.forEach(element => {
      
    })`,
    url: "placeholderList url",
  },
  {
    repoName: "placeholderList",
    description: `array.forEach(element => {
      
    })`,
    url: "placeholderList url",
  },
  {
    repoName: "placeholderList",
    description: `array.forEach(element => {
      
    })`,
    url: "placeholderList url",
  },
  {
    repoName: "placeholderList",
    description: `array.forEach(element => {
      
    })`,
    url: "placeholderList url",
  },
];

export async function getFetchedList(
  userName: string,
  repoName: string,
  branchName: string,
): Promise<fetchedList[]> {
  return placeholderList;
}

const parsers: { [key: string]: (readme: string) => fetchedList[] } = {
  default: (readme) => placeholderList,
};