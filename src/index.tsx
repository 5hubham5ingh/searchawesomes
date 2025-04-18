import { render } from "preact";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import "./style.css";
import { fetchedList, getCachedList, getFetchedList } from "./utils";
import {
  AppContext,
  AppContextProvider,
  awesomeList,
  useAppContext,
  useAppState,
} from "./state";
import FuzzySearch from "fuzzy-search";
import {
  Notification,
  NotificationProvider,
  NotificationType,
  useNotification,
} from "./notification";
import { Settings, SettingsProvider, useSettings } from "./setting";

const ToggleTheme = () => {
  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const theme =
      root.getAttribute("data-theme") === "light" ? "dark" : "light";

    const currentForeground =
      getComputedStyle(root).getPropertyValue("--foreground");
    const currentBackground =
      getComputedStyle(root).getPropertyValue("--background");

    root.style.setProperty("--foreground", currentBackground.trim());
    root.style.setProperty("--background", currentForeground.trim());

    root.setAttribute("data-theme", theme);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "d") {
        event.preventDefault();
        toggleTheme();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme]);

  return (
    <button id="toggleTheme" onClick={toggleTheme} title="Toggle Theme">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        fill="var(--foreground)"
      >
        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm40-83q119-15 199.5-104.5T800-480q0-123-80.5-212.5T520-797v634Z" />
      </svg>
    </button>
  );
};

const Logo = () => {
  const { resetState } = useAppContext();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "h") {
        event.preventDefault();
        resetState();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [resetState]);

  return (
    <button id="logo" onClick={resetState} title="Home">
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 788.000000 539.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          transform="translate(0.000000,539.000000) scale(0.100000,-0.100000)"
          fill="var(--foreground)"
          stroke="none"
        >
          <path
            d="M1949 5179 c-306 -32 -627 -144 -860 -301 -114 -76 -294 -253 -366
-358 -161 -238 -227 -466 -227 -790 0 -622 252 -963 928 -1262 108 -48 527
-188 786 -263 236 -69 340 -106 465 -165 214 -101 323 -222 361 -399 53 -249
-57 -472 -289 -586 -369 -180 -930 -118 -1384 153 -120 72 -321 222 -410 306
l-71 66 -160 -212 c-88 -117 -206 -273 -262 -346 l-103 -134 54 -55 c322 -330
788 -576 1279 -677 194 -39 299 -49 515 -50 304 0 595 52 808 143 51 21 93 38
95 37 1 -2 -7 -29 -18 -61 -11 -32 -20 -60 -20 -62 0 -1 217 -3 483 -3 l484 0
10 32 c6 18 124 323 263 678 138 355 323 830 410 1055 87 226 229 592 315 815
87 223 197 509 245 635 167 437 157 414 170 380 6 -16 42 -109 80 -205 38 -96
118 -303 179 -460 60 -157 179 -466 265 -688 86 -221 156 -404 156 -407 0 -3
-179 -5 -397 -5 l-398 0 -59 -148 c-32 -81 -98 -241 -147 -357 -48 -115 -97
-234 -108 -263 l-21 -52 728 0 727 0 58 -148 c31 -81 120 -308 196 -505 77
-198 141 -360 143 -360 2 -1 224 -1 494 1 l491 2 -109 268 c-309 756 -1727
4286 -1844 4590 l-39 102 -403 -2 -404 -3 -114 -290 c-193 -487 -836 -2103
-958 -2405 -94 -232 -117 -280 -122 -260 -16 53 -88 183 -143 257 -109 147
-242 255 -451 366 -211 112 -360 166 -815 297 -407 117 -552 167 -714 247
-112 55 -145 77 -202 133 -99 97 -132 171 -137 307 -3 83 0 115 17 170 56 187
199 305 446 369 124 32 359 43 509 25 326 -41 636 -182 931 -422 l71 -57 91
137 c50 75 159 234 243 354 l152 219 -33 29 c-307 265 -729 471 -1142 554
-204 41 -515 56 -718 34z"
          />
        </g>
      </svg>
    </button>
  );
};

const OpenBookmark = () => {
  const { notify } = useNotification();
  const { state, updateState, resetState } = useAppContext();
  const toggleBookmarkWindow = () => {
    console.log("Toggle bookmarks.");
    if (state.repoName === "Bookmarks") {
      resetState();
    } else {
      const bookmarkData = localStorage.getItem("bookmarks");
      if (bookmarkData) {
        const bookmarks = JSON.parse(bookmarkData);
        updateState({
          repoName: "Bookmarks",
          description: "Your favorite repositories.",
          list: bookmarks,
        });
      } else notify("No bookmark exists.", NotificationType.Error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "b") {
        event.preventDefault();
        toggleBookmarkWindow();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleBookmarkWindow]);

  return (
    <button
      title="Open Bookmarks"
      id="openBookmark"
      onClick={toggleBookmarkWindow}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        fill="var(--foreground)"
      >
        <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" />
      </svg>
    </button>
  );
};

const SettingButton = () => {
  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        updateSettings({ ...settings, visibility: true });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [settings]);

  return (
    <button
      id="openSetting"
      title={"Open Settings"}
      onClick={() => updateSettings({ ...settings, visibility: true })}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        fill="var(--foreground)"
      >
        <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
      </svg>
    </button>
  );
};

const Header = () => {
  const { state } = useAppContext();
  const isHome = state.repoName === "All" || state.repoName === "";
  const heading = isHome
    ? "Search Awesomes"
    : state.repoName
        .split("-")
        .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
        .join(" ");
  return (
    <header>
      <div id={"quickActions"}>
        <Logo />
        <OpenBookmark />
        <ToggleTheme />
        <SettingButton />
      </div>
      <h1>{heading}</h1>
      <p>
        {isHome
          ? "Search from hundreds of awesome lists of tools and resources maintained by numerous awesome contributors."
          : state.description}
      </p>
    </header>
  );
};

const Search = () => {
  const { state, updateState } = useAppContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = useCallback(
    (e: Event) => {
      const query = (e.target as HTMLInputElement).value;
      updateState({ ...state, query });
    },
    [state, updateState]
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <input
      type="text"
      ref={inputRef}
      onInput={handleInput}
      placeholder="Search"
      value={state.query}
    />
  );
};

const ProjectLink = () => (
  <a href="https://github.com/5hubham5ingh/searchawesomes">
    <svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g
        transform="translate(-140.000000, -7559.000000)"
        fill="var(--background)"
      >
        <g transform="translate(56.000000, 160.000000)">
          <path d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"></path>
        </g>
      </g>
    </svg>
  </a>
);

const AddOrRemoveBookmark = ({ resource }) => {
  const bookmarks = localStorage.getItem("bookmarks");
  const parsedBookmarks = bookmarks && JSON.parse(bookmarks);
  const [isBookmarked, setBookmark] = useState(
    parsedBookmarks?.some(
      (bookmark) =>
        bookmark.repoName === resource.repoName &&
        bookmark.userName === resource.userName
    )
  );
  const addToBookmarks = useCallback(() => {
    const bookmarks = localStorage.getItem("bookmarks");
    const parsedBookmarks = bookmarks && JSON.parse(bookmarks);
    const updatedBookmarks = [...(parsedBookmarks || []), resource];
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    setBookmark(true);
  }, [resource]);

  const removeBookmark = useCallback(() => {
    const newBookmarks = parsedBookmarks.filter(
      (bookmark) =>
        bookmark.repoName !== resource.repoName ||
        bookmark.userName !== resource.userName
    );
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    setBookmark(false);
  }, [resource]);

  return isBookmarked ? (
    <button onClick={removeBookmark}>Remove Bookmark</button>
  ) : (
    <button onClick={addToBookmarks}>Bookmark</button>
  );
};

const CardButtons = ({ resource }: { resource: fetchedList & awesomeList }) => {
  const { state, updateState } = useAppContext();
  const { notify } = useNotification();
  const { settings } = useSettings();

  const handleClick = useCallback(() => {
    notify(`Fetching ${resource.repoName}...`, NotificationType.Info);
    getFetchedList(
      resource.userName,
      resource.repoName,
      resource.branchName
    ).then((list) => {
      if (list) {
        notify(
          `Fetched from "${resource.repoName}" repo.`,
          NotificationType.Log
        );
        updateState({
          userName: resource.userName,
          repoName: resource.repoName,
          branchName: resource.branchName,
          description: resource.description,
          list,
          query: "",
        });
      }
    });
    const cachedList = getCachedList(resource.userName, resource.repoName);
    if (cachedList) {
      notify(`Loaded "${resource.repoName}" from cache.`, NotificationType.Log);
      updateState({
        userName: resource.userName,
        repoName: resource.repoName,
        branchName: resource.branchName,
        description: resource.description,
        list: cachedList,
        query: "",
      });
    }
  }, [resource.repoName, state, updateState]);

  return (
    <div className="cardButtons">
      {resource.url ? (
        <button
          title={`Open ${resource.repoName}`}
          onClick={() => window.open(resource.url, settings.openLinksIn)}
        >
          Explore
        </button>
      ) : (
        <button title={`Search ${resource.repoName}`} onClick={handleClick}>
          Explore
        </button>
      )}
      <AddOrRemoveBookmark resource={resource} />
    </div>
  );
};

const SearchResults = () => {
  const { state } = useAppContext();
  const { settings } = useSettings();

  console.log("Initial state...", state);
  const searcher = useMemo(
    () =>
      new FuzzySearch(state.list as any, ["repoName", "description"], {
        sort: true,
      }),
    [state.repoName]
  );

  const filteredResults = useMemo(() => {
    return searcher.search(state.query)?.slice(0, settings.resultLimit) || [];
  }, [state.query, state.list, settings.resultLimit]);

  console.log("Updating search result...", filteredResults);
  return (
    <div id="searchResults">
      {filteredResults.map((resource: fetchedList & awesomeList, i) => (
        <fieldset className="card" key={`${resource.repoName}${i}`}>
          <legend>{resource.repoName}</legend>
          {resource.description}
          <CardButtons resource={resource} />
        </fieldset>
      ))}
    </div>
  );
};

function App() {
  return (
    <NotificationProvider>
      <Notification />
      <SettingsProvider>
        <AppContextProvider>
          <div id="top-container">
            <Header />
            <div id="search">
              <Search />
              <ProjectLink />
            </div>
          </div>
          <SearchResults />
        </AppContextProvider>
        <Settings />
      </SettingsProvider>
    </NotificationProvider>
  );
}

render(<App />, document.getElementById("app"));
