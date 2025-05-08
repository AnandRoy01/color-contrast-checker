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
  const contentRef = useRef<HTMLDivElement>(null);

  // Simple fade-in animation once
  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      // Animate container first
      animate(containerRef.current, { opacity: [0, 1] }, { duration: 0.3 });

      // Then animate content with a slight delay
      animate(
        contentRef.current,
        { opacity: [0, 1], y: [10, 0] },
        { duration: 0.4, delay: 0.1 }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col">
      <h2 className={`text-lg font-medium ${themeStyles.app.text} mb-3`}>
        Preview
      </h2>
      <div
        style={{ backgroundColor, color: foregroundColor }}
        className="flex-grow p-5 sm:p-6 rounded-xl transition-colors duration-300 flex flex-col"
      >
        <div
          ref={contentRef}
          className="flex-grow flex flex-col justify-center opacity-0"
        >
          <h3 className="text-2xl font-bold mb-5">Sample Heading</h3>
          <p className="mb-5 text-base leading-relaxed">
            This is how your text will look with the selected colors. Good
            contrast ensures that your content is readable by everyone.
          </p>
          <p className="mb-5 leading-relaxed">
            The quick brown fox jumps over the lazy dog.
          </p>

          <div className="space-y-3 mb-8">
            <p className="text-xs">Small Text (12px)</p>
            <p className="text-sm">Medium Text (14px)</p>
            <p className="text-base">Standard Text (16px)</p>
            <p className="text-lg">Large Text (18px)</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between">
            <button
              className="px-5 py-2.5 rounded-md border transition-colors duration-300 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                backgroundColor: foregroundColor,
                color: backgroundColor,
                borderColor: foregroundColor,
              }}
            >
              Primary Button
            </button>
            <button
              className="px-5 py-2.5 rounded-md border transition-colors duration-300 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                backgroundColor: "transparent",
                color: foregroundColor,
                borderColor: foregroundColor,
              }}
            >
              Secondary Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewSection;
