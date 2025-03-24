import { createContext } from "preact";
import { fetchedList, getCachedList, getFetchedList } from "./utils";
import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import awesomeRepoListJson from "./awesomeRepoList";

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
  description?: string;
  query: string;
  list: awesomeList[] | fetchedList[];
}

interface AppContextType {
  state: IState;
  updateState: (newState: Partial<IState>) => void;
  resetState: () => void;
}

export const AppContext = createContext<AppContextType>({
  state: {
    repoName: "",
    userName: "",
    branchName: "",
    description: "",
    query: "",
    list: [],
  },
  updateState: () => {},
  resetState: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const useAppState = () => {
  const params = new URLSearchParams(location.search);

  const initialState: IState = {
    repoName: "All",
    userName: "",
    branchName: "",
    description: "",
    query: "",
    list: awesomeRepoList,
  };

  const [state, setState] = useState<IState>(initialState);

  useEffect(() => {
    const currentState: Partial<IState> = {
      repoName: params.get("repoName"),
      userName: params.get("userName"),
      branchName: params.get("branchName"),
      query: params.get("query"),
    };
    if (
      (currentState.repoName !== "All",
      currentState.repoName,
      currentState.userName,
      currentState.branchName)
    ) {
      getFetchedList(
        currentState.userName,
        currentState.repoName,
        currentState.branchName
      ).then((list) => {
        if (list) {
          console.log("Fetched list...", list);
          updateState({ ...currentState, list });
        }
      });
      const cacheData = getCachedList(
        currentState.userName,
        currentState.repoName
      );
      if (cacheData) {
        console.log("Cached list...", cacheData);
        updateState({ ...currentState, list: cacheData });
      }
    }

    window.addEventListener("popstate", resetState);

    return () => {
      window.removeEventListener("popstate", resetState);
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

  const resetState = () => {
    updateState(initialState);
  };

  return { state, updateState, resetState };
};
