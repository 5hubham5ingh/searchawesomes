export default [
  {
    userName: "rothgar",
    repoName: "awesome-tuis",
    branchName: "master",
    description:
      "A curated list of awesome TUI (Text User Interface) libraries and tools.",
    parserRegex: /- \[([^\]]+)\]\(([^)]+)\) (.+)$/,
  },
  {
    userName: "toolleeo",
    repoName: "awesome-cli-apps-in-a-csv",
    branchName: "master",
    description:
      "The largest Awesome Curated list of command line programs (CLI/TUI).",
    parserRegex: /\* \[([^\]]+)\]\(([^)]+)\) - (.+?)$/,
  },
  {
    userName: "jaywcjlove",
    repoName: "awesome-mac",
    branchName: "master",
    description:
      "An actively maintained list of awesome MacOs softwares and tools.",
    parserRegex: /\* \[([^\]]+)\]\(([^)]+)\) - (.+?)(?:[ ]+\[|\n|$)/,
  },
] as {
  userName: string;
  repoName: string;
  branchName: string;
  description: string;
  parserRegex: RegExp;
}[];
