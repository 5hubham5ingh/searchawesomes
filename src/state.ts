import { createContext } from "preact";
import { fetchedList, getFetchedList } from "./utils";
import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import awesomeRepoListJson from "./awesomeRepoList.json";

export type awesomeList = {
  userName: string;
  repoName: string;
  branchName: string;
  description: string;
};

const awesomeRepoList: awesomeList[] = awesomeRepoListJson;

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
    console.log("Updating state...", newState);
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
