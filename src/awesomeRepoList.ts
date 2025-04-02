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
  {
    userName: "hyprland-community",
    repoName: "awesome-hyprland",
    branchName: "main",
    description:
      "Awesome list for Hyprland, that includes useful tools and libraries that either work or are designed for Hyprland!",
    parserRegex:
      /- \[([^\]]+)\]\(([^)]+)\) (?:!\[[^\]]+\]\[[^\]]+\] )*\(([^)]+)\)/,
  },
  {
    userName: "awesome-selfhosted",
    repoName: "awesome-selfhosted",
    branchName: "master",
    description: "Awesome lists about all kinds of interesting topics ",
    parserRegex: /^\-\s+\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)\s+-\s+([^([]+)/,
  },
  {
    userName: "vinta",
    repoName: "awesome-python",
    branchName: "master",
    description: "Awesome lists about all kinds of interesting topics ",
    parserRegex: /^\*\s+\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)\s+-\s+(.+)$/,
  },
] as {
  userName: string;
  repoName: string;
  branchName: string;
  description: string;
  parserRegex: RegExp;
}[];
