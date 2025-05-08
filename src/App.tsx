import { useRef, useEffect } from "react";
import { animate } from "motion";
import ColorInput from "./components/ColorInput";
import ContrastRatio from "./components/ContrastRatio";
import PreviewSection from "./components/PreviewSection";
import FormatSelector from "./components/FormatSelector";
import ThemeToggle from "./components/ThemeToggle";
import { useStore } from "./store";
import { calculateContrastRatio } from "./utils/colorUtils";
import { THEME } from "./constants/theme";

function App() {
  const {
    foregroundColor,
    backgroundColor,
    setForegroundColor,
    setBackgroundColor,
    theme,
  } = useStore();

  const containerRef = useRef<HTMLElement>(null);

  // Initial fade-in animation
  useEffect(() => {
    if (containerRef.current) {
      animate(
        containerRef.current,
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.4, easing: [0.25, 0.1, 0.25, 1.0] }
      );
    }
  }, []);

  const themeStyles = THEME[theme];
  const contrastRatio = calculateContrastRatio(
    foregroundColor,
    backgroundColor
  );

  return (
    <main
      className={`w-full min-h-screen ${themeStyles.app.background} [background-size:16px_16px] flex items-center justify-center p-3 sm:p-4`}
    >
      <section
        ref={containerRef}
        className={`
          opacity-0 rounded-2xl w-full max-w-md border ${themeStyles.app.section} 
          ${themeStyles.app.border} shadow-lg overflow-hidden
        `}
      >
        <div
          className={`p-4 flex justify-between items-center border-b ${themeStyles.app.border}`}
        >
          <h1 className={`text-base font-semibold ${themeStyles.app.text}`}>
            Color Contrast Checker
          </h1>
          <div className="flex gap-2">
            <button
              id="reset-button"
              onClick={() => useStore.getState().resetColors()}
              className={`p-1.5 rounded-md ${themeStyles.button.secondary} transition-colors hover:scale-105 active:scale-95`}
              aria-label="Reset color values"
              title="Reset to default colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 ${themeStyles.app.text} transition-transform hover:rotate-180`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
            <ThemeToggle />
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-4">
            <FormatSelector />

            <ColorInput
              label="Background Color"
              colorValue={backgroundColor}
              onColorChange={setBackgroundColor}
            />

            <ColorInput
              label="Foreground Color"
              colorValue={foregroundColor}
              onColorChange={setForegroundColor}
            />
          </div>

          <ContrastRatio ratio={contrastRatio} />

          <PreviewSection
            backgroundColor={backgroundColor}
            foregroundColor={foregroundColor}
          />
        </div>
      </section>
    </main>
  );
}

export default App;
