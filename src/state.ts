import { createContext } from "preact";
import { fetchedList, getFetchedList } from "./utils";
import { useContext, useCallback, useState, useEffect } from "preact/hooks";

export type awesomeList = {
  userName: string;
  repoName: string;
  branchName: string;
  description: string;
};

const awesomeRepoList: awesomeList[] = [
  {
    userName: "rothgar",
    repoName: "awesome-tuis",
    branchName: "master",
    description: "A curated list of awesome TUI (Text User Interface) libraries and tools.",
  },
  {
    userName: "temp1l",
    repoName: "temp2",
    branchName: "main",
    description: "llorem ipsum dolor sit amet loremlorem ipsum dolor sit amet",
  },
  {
    userName: "temp1l",
    repoName: "temp3",
    branchName: "main",
    description: "llorem ipsum dolor sit amet loremlorem ipsum dolor sit amet",
  },
  {
    userName: "temp1l",
    repoName: "temp4",
    branchName: "main",
    description: "llorem ipsum dolor sit amet loremlorem ipsum dolor sit amet",
  },
  {
    userName: "temp1l",
    repoName: "temp5",
    branchName: "main",
    description: "llorem ipsum dolor sit amet loremlorem ipsum dolor sit amet",
  },
  {
    userName: "temp1l",
    repoName: "temp6",
    branchName: "main",
    description: "llorem ipsum dolor sit amet loremlorem ipsum dolor sit amet",
  },
];

interface IState {
  repoName: string;
  userName: string;
  branchName: string;
  query: string;
  list: awesomeList[] | fetchedList[];
}

interface AppContextType {
  state: IState;
  updateState: (newState: Partial<IState>) => void;
}

export const AppContext = createContext<AppContextType>({
  state: {
    repoName: "",
    userName: "",
    branchName: "",
    query: "",
    list: [],
  },
  updateState: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const useAppState = () => {
  const params = new URLSearchParams(location.search);

  const initialState: IState = {
    repoName: params.get("repoName") || "All",
    userName: params.get("userName") || "",
    branchName: params.get("branchName") || "",
    query: "",
    list: awesomeRepoList,
  };

  const [state, setState] = useState<IState>(initialState);

  useEffect(() => {
    if (
      (initialState.repoName !== "All",
        initialState.repoName !== "",
        initialState.userName !== "",
        initialState.branchName !== "")
    ) {
      console.log("Fetching list...");
      getFetchedList(state.userName, state.repoName, state.branchName).then(
        (list) => setState((prevState) => ({ ...prevState, list })),
      );
    }
    const handlePopstate = () => {
      const newParams = new URLSearchParams(location.search);
      const newState: IState = {
        repoName: newParams.get("repoName") || "",
        userName: newParams.get("userName") || "",
        branchName: newParams.get("branchName") || "",
        query: newParams.get("query") || "",
        list: initialState.list,
      };
      setState(newState);
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  const updateState = useCallback((newState: Partial<IState>) => {
    setState((prevState) => {
      const updatedState = { ...prevState, ...newState };

      const url = new URL(location.href);

      ["userName", "branchName", "repoName"].forEach((param) => {
        const value = updatedState[param as keyof IState] as string;
        value
          ? url.searchParams.set(param, value)
          : url.searchParams.delete(param);
      });

      history.pushState({}, "", url.toString());
      return updatedState;
    });
  }, []);

  return { state, updateState };
};
