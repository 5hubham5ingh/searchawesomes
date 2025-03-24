import { render } from "preact";
import { useCallback, useEffect, useMemo, useRef } from "preact/hooks";
import "./style.css";
import { fetchedList, getFetchedList } from "./utils";
import { awesomeList, AppContext, useAppContext, useAppState } from "./state";
import FuzzySearch from "fuzzy-search";

const ToggleTheme = () => {
  const toggleTheme = () => {
    const theme =
      document.documentElement.getAttribute("data-theme") === "light"
        ? "dark"
        : "light";
    const colors =
      theme === "light"
        ? { foreground: "black", background: "lightgray" }
        : { foreground: "lightgray", background: "black" };

    document.documentElement.style.setProperty(
      "--foreground",
      colors.foreground
    );
    document.documentElement.style.setProperty(
      "--background",
      colors.background
    );
    document.documentElement.setAttribute("data-theme", theme);
  };
  return (
    <button onClick={toggleTheme} type="button">
      Switch Theme
    </button>
  );
};

const Logo = () => {
  return (
    <svg
      id={"logo"}
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="788.000000pt"
      height="539.000000pt"
      viewBox="0 0 788.000000 539.000000"
      preserveAspectRatio="xMidYMid meet"
      href={"/"}
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
  );
};
const Header = () => {
  const { state } = useAppContext();
  const isHome = state.repoName === "All" && state.userName === "";
  const heading = isHome ? "Search Awesomes" : state.repoName.split("-").map(word => `${word[0].toUpperCase()}${word.slice(1)}`).join(" ");
  return (
    <header>
      {/* <ToggleTheme /> */}
      {!isHome ? <Logo /> : null}
      {isHome ? <h1>{heading}</h1> : <h2>{heading}</h2>}
      {isHome ? (
        <p>
          Search from hundreds of awesome lists of tools and resources
          maintained by numerous awesome contributors.
        </p>
      ) : null}
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
      <g transform="translate(-140.000000, -7559.000000)" fill="black">
        <g transform="translate(56.000000, 160.000000)">
          <path d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"></path>
        </g>
      </g>
    </svg>
  </a>
);

const CardButtons = ({ resource }: { resource: fetchedList & awesomeList }) => {
  const { state, updateState } = useAppContext();

  const handleClick = useCallback(() => {
    getFetchedList(
      resource.userName,
      resource.repoName,
      resource.branchName
    ).then((list) => {
      updateState({
        userName: resource.userName,
        repoName: resource.repoName,
        branchName: resource.branchName,
        list,
        query: "",
      });
    });
  }, [resource.repoName, state, updateState]);

  return (
    <div className="cardButtons">
      {resource.url ? (
        <button
          title={`Open ${resource.repoName}`}
          onClick={() => window.open(resource.url, "_blank", "noreferrer")}
        >
          Explore
        </button>
      ) : (
        <button title={`Search ${resource.repoName}`} onClick={handleClick}>
          Explore
        </button>
      )}
      <button>Bookmark</button>
    </div>
  );
};

const SearchResults = () => {
  const { state } = useAppContext();

  console.log("Initial state...", state);
  const searcher = useMemo(
    () =>
      new FuzzySearch(state.list as any, ["repoName", "description"], {
        sort: true,
      }),
    [state.repoName]
  );

  const filteredResults = useMemo(() => {
    return searcher.search(state.query)?.slice(0, 11) || [];
  }, [state.query, state.list]);

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

export function App() {
  const appContext = useAppState();
  return (
    <AppContext.Provider value={appContext}>
      <div id="top-container">
        <Header />
        <div id="search">
          <Search />
          <ProjectLink />
        </div>
      </div>
      <SearchResults />
    </AppContext.Provider>
  );
}

render(<App />, document.getElementById("app"));
