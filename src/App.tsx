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

  // Single initial fade-in animation
  useEffect(() => {
    if (containerRef.current) {
      animate(containerRef.current, {
        duration: 0.4,
        easing: [0.25, 0.1, 0.25, 1.0],
        opacity: [0, 1],
        y: [20, 0],
      });
    }
  }, []);

  const themeStyles = THEME[theme];
  const contrastRatio = calculateContrastRatio(
    foregroundColor,
    backgroundColor
  );

  return (
    <main
      className={`w-full min-h-screen ${themeStyles.app.background} [background-size:16px_16px] flex items-center justify-center p-4 sm:p-6 md:p-8`}
    >
      <section
        ref={containerRef}
        className={`
          opacity-0 rounded-3xl w-full max-w-5xl border-2 ${themeStyles.app.section} 
          ${themeStyles.app.border} shadow-lg overflow-hidden
          flex flex-col md:flex-row
        `}
      >
        {/* Preview Section - Left side */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 md:p-8 flex items-center justify-center">
          <PreviewSection
            backgroundColor={backgroundColor}
            foregroundColor={foregroundColor}
          />
        </div>

        {/* Controls - Right side */}
        <div
          className={`w-full md:w-1/2 p-5 sm:p-6 md:p-8 border-t md:border-t-0 md:border-l ${themeStyles.app.border}`}
        >
          <div className="flex justify-between items-center mb-6">
            <FormatSelector />
            <div className="flex gap-3">
              <button
                id="reset-button"
                onClick={() => useStore.getState().resetColors()}
                className={`p-2 rounded-lg ${themeStyles.button.secondary} transition-colors hover:scale-105 active:scale-95`}
                aria-label="Reset color values"
                title="Reset to default colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-5 h-5 ${themeStyles.app.text} transition-transform hover:rotate-180`}
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

          <div className="space-y-6 mb-8">
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
        </div>
      </section>
    </main>
  );
}

export default App;
