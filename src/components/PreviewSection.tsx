import { useRef, useEffect } from "react";
import { animate } from "motion";
import { useStore } from "../store";
import { THEME } from "../constants/theme";

interface PreviewSectionProps {
  backgroundColor: string;
  foregroundColor: string;
}

function PreviewSection({
  backgroundColor,
  foregroundColor,
}: PreviewSectionProps) {
  const { theme } = useStore();
  const themeStyles = THEME[theme];

  const containerRef = useRef<HTMLDivElement>(null);

  // Simple fade-in animation once
  useEffect(() => {
    if (containerRef.current) {
      animate(containerRef.current, { opacity: [0, 1] }, { duration: 0.3 });
    }
  }, []);

  return (
    <div className="w-full">
      <h2 className={`text-sm font-medium ${themeStyles.app.text} mb-2`}>
        Preview
      </h2>
      <div
        ref={containerRef}
        style={{ backgroundColor, color: foregroundColor }}
        className="w-full rounded-xl transition-colors duration-300 opacity-0 p-4 text-sm"
      >
        <h3 className="text-base font-bold mb-2">Sample Heading</h3>
        <p className="mb-2 text-xs leading-relaxed">
          This is how your text will look with the selected colors. Good
          contrast ensures readability.
        </p>

        <div className="flex flex-wrap gap-2 mt-3 mb-3">
          <p className="text-xs">Small (12px)</p>
          <p className="text-sm">Medium (14px)</p>
        </div>

        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 text-xs rounded-md border transition-colors"
            style={{
              backgroundColor: foregroundColor,
              color: backgroundColor,
              borderColor: foregroundColor,
            }}
          >
            Primary
          </button>
          <button
            className="px-3 py-1.5 text-xs rounded-md border transition-colors"
            style={{
              backgroundColor: "transparent",
              color: foregroundColor,
              borderColor: foregroundColor,
            }}
          >
            Secondary
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreviewSection;
