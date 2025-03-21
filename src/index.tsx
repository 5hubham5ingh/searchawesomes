import { render } from "preact";
import "./style.css";
import { useState } from "preact/hooks";
import awesomeList from "./awesomeList";

export function App() {
  return (
    <>
      <div id="top-container">
        <Header />
        <Search />
      </div>
      <SearchResults />
    </>
  );
}

function Header() {
  const switchTheme = () => {
    const theme = document.documentElement.getAttribute("data-theme");
    if (theme === "light") {
      document.documentElement.style.setProperty("--background", "black");
      document.documentElement.style.setProperty("--foreground", "gray");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.style.setProperty("--foreground", "black");
      document.documentElement.style.setProperty("--background", "gray");
      document.documentElement.setAttribute("data-theme", "light");
    }
  };
  return (
    <header>
      <button onClick={switchTheme} type="button">
        Switch Theme
      </button>
      <h1>Search Awesomes</h1>
      <p>
        Search from hundreds of awesome lists of tools and resources maintained
        by numerous awesome contributors.
      </p>
    </header>
  );
}

function useSearchQuery() {
  const queryParam = new URLSearchParams(location.search).get("q");
  const [searchQuery, setSearchQuery] = useState(queryParam || "");
  const handleSearch = (e: Event) => {
    const query = (e.target as HTMLInputElement).value;
    setSearchQuery(query);
    const url = new URL(location.href);
    if (query.length) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    // history.pushState({}, "", url.toString());
  };
  return { searchQuery, handleSearch };
}

function Search() {
  const { searchQuery, handleSearch } = useSearchQuery();
  return (
    <div id="search">
      <input
        type="text"
        onInput={handleSearch}
        placeholder="Search"
        value={searchQuery}
      />
      <ProjectLink />
    </div>
  );
}

function SearchResults() {
  return (
    <div id="searchResults">
      {awesomeList.map((resource, i) => (
        <fieldset className="card">
          <legend>
            {resource.name}
            {` [${i}]`}
          </legend>
          {resource.description}
          <CardsButtons resource={resource} />
        </fieldset>
      ))}
    </div>
  );
}

function CardsButtons({ resource }) {
  return (
    <div className="cardButtons">
      {resource.link ? (
        <a href={resource.link} target="_blank" rel="noreferrer">
          Explore
        </a>
      ) : null}
      {resource.url ? <button>Explore</button> : null}
      <button>Bookmark</button>
    </div>
  );
}

function ProjectLink() {
  return (
    <a href="https://github.com/5hubham5ingh/searchawesomes">
      <svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g
          id="Page-1"
          stroke="none"
          stroke-width="1"
          fill="black"
          fill-rule="evenodd"
        >
          <g
            id="Dribbble-Light-Preview"
            transform="translate(-140.000000, -7559.000000)"
            fill="var(--active-color)"
          >
            <g id="icons" transform="translate(56.000000, 160.000000)">
              <path
                d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"
                id="github-[#142]"
              ></path>
            </g>
          </g>
        </g>
      </svg>
    </a>
  );
}

render(<App />, document.getElementById("app"));
