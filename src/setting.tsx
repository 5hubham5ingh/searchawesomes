import {
  MutableRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import { store } from "./utils";
import { createContext, h, Ref } from "preact";
import { forwardRef } from "preact/compat";

interface ISettings {
  openLinksIn: "_blank" | "_self";
  css: string;
  visibility: boolean;
  resultLimit: number;
}

interface ISettingsContext {
  settings: ISettings;
  updateSettings: (settings: ISettings) => void;
}

export const SettingsContext = createContext<ISettingsContext>({
  settings: {
    openLinksIn: "_blank",
    css: "",
    visibility: false,
    resultLimit: 11,
  },
  updateSettings: () => {},
});

let initialSettings;
if ((initialSettings = store.get("settings"))) {
  initialSettings = JSON.parse(initialSettings);
} else {
  initialSettings = {
    openLinksIn: "_blank",
    css: "",
    visibility: false,
    resultLimit: 11,
  };
}
export function SettingsProvider({
  children,
}: {
  children: preact.ComponentChildren;
}) {
  console.log("Initial settings: ", initialSettings);
  const [settings, setSetting] = useState<ISettings>(initialSettings);

  const injectCss = useCallback((css: string) => {
    console.log("Injecting css: ");
    let customStyle = document.getElementById("userCss");
    if (!customStyle) {
      customStyle = document.createElement("style");
      customStyle.id = "userCss";
      customStyle.textContent = css;
      document.head.appendChild(customStyle);
    } else customStyle.textContent = css;
  }, []);

  useEffect(() => {
    injectCss(settings.css);
  }, [settings.css]);

  const updateSettings = useCallback(
    (newSettings: ISettings) => {
      console.log("Updaing settings: ", newSettings);
      setSetting((settings) => {
        const updatedSettings = { ...settings, ...newSettings };
        store.set("settings", JSON.stringify(updatedSettings));
        return updatedSettings;
      });
    },
    [injectCss],
  );

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

const OpenLinksIn = forwardRef(
  (
    { settings }: { settings: ISettings },
    ref: MutableRef<typeof settings.openLinksIn>,
  ) => {
    const [currentActive, setCurrentActive] = useState(settings.openLinksIn);
    const onOpenLinksInNewTab = useCallback(() => {
      ref.current = "_blank";
      setCurrentActive("_blank");
    }, []);

    const onOpenLinksInSameTab = useCallback(() => {
      ref.current = "_self";
      setCurrentActive("_self");
    }, []);

    return (
      <>
        <button
          onClick={onOpenLinksInNewTab}
          style={currentActive === "_blank"
            ? "background: var(--foreground); color: var(--background)"
            : ""}
        >
          New tab
        </button>
        <button
          onClick={onOpenLinksInSameTab}
          style={currentActive === "_self"
            ? "background: var(--foreground); color: var(--background)"
            : ""}
        >
          Same tab
        </button>
      </>
    );
  },
);

export function Settings() {
  const { settings, updateSettings } = useSettings();
  const openLinksInRef = useRef<typeof settings.openLinksIn>(null);
  const cssInputRef = useRef<HTMLTextAreaElement | null>(null);
  const resultLimitRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = useCallback(() => {
    const customCss = cssInputRef?.current?.value;
    const resultLimit = resultLimitRef?.current?.value;
    const settings: ISettings = {} as ISettings;
    settings.css = customCss || "";
    settings.resultLimit = parseInt(resultLimit) || 11;
    if (openLinksInRef.current) {
      settings.openLinksIn = openLinksInRef.current;
    }

    settings.visibility = false;
    updateSettings(settings);
  }, []);

  const handleClose = useCallback(() => {
    updateSettings({ ...settings, visibility: false });
  }, [updateSettings]);

  if (settings.visibility) {
    return (
      <div id="SettingsBackground">
        <div id="SettingsContainer">
          <header>
            <h2>Setting</h2>
            <div id="SettingsAction">
              <button onClick={handleSubmit}>save</button>
              <span>|</span>
              <button onClick={handleClose}>cancel</button>
            </div>
          </header>
          <section>
            <h3>Result limit</h3>
            <input type="number" min="11" max="100" ref={resultLimitRef} value={settings.resultLimit} />
          </section>
          <section id="OpenLinkSetting">
            <h3>Open the links in</h3>
            <OpenLinksIn settings={settings} ref={openLinksInRef} />
          </section>
          <section>
            <h3>Custom CSS</h3>
            <textarea value={settings.css} ref={cssInputRef} />
          </section>
          <section id="shortcuts">
            <code>Ctrl</code> + <code>s</code> <p> Settings</p>
            <span>|</span>
            <code>Ctrl</code> + <code>b</code> <p> Bookmarks</p>
            <span>|</span>
            <code>Ctrl</code> + <code>h</code> <p> Homepage</p>
            <span>|</span>
            <code>Ctrl</code> + <code>d</code> <p> Dark mode</p>
          </section>
        </div>
      </div>
    );
  }
}
