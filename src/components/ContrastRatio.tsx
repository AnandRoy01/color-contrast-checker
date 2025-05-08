import { useRef, useEffect } from "react";
import { animate } from "motion";
import { THEME } from "../constants/theme";
import { useStore } from "../store";

interface ContrastRatioProps {
  ratio: string;
}

function getRatingInfo(ratio: string): {
  text: string;
  color: string;
  wcagLevel: string;
} {
  const numericRatio = parseFloat(ratio.split(":")[0]);

  if (numericRatio >= 7) {
    return {
      text: "AAA (Enhanced)",
      color: "text-green-500",
      wcagLevel: "WCAG 2.1 Level AAA",
    };
  } else if (numericRatio >= 4.5) {
    return {
      text: "AA (Good)",
      color: "text-yellow-500",
      wcagLevel: "WCAG 2.1 Level AA",
    };
  } else if (numericRatio >= 3) {
    return {
      text: "AA Large (Limited)",
      color: "text-orange-500",
      wcagLevel: "WCAG 2.1 Level AA for large text only",
    };
  } else {
    return {
      text: "Fails WCAG",
      color: "text-red-500",
      wcagLevel: "Does not meet WCAG 2.1 requirements",
    };
  }
}

function ContrastRatio({ ratio }: ContrastRatioProps) {
  const { theme } = useStore();
  const themeStyles = THEME[theme];
  const { text, color, wcagLevel } = getRatingInfo(ratio);

  const ratioRef = useRef<HTMLSpanElement>(null);

  // Simple pulse animation when ratio changes
  useEffect(() => {
    if (ratioRef.current) {
      // Quick scale pulse effect
      animate(
        ratioRef.current,
        { scale: [1, 1.05, 1] },
        { duration: 0.3, easing: "ease-in-out" }
      );
    }
  }, [ratio]);

  return (
    <div className={`p-5 sm:p-6 ${themeStyles.preview.section} rounded-xl`}>
      <h2 className={`text-lg font-medium ${themeStyles.app.text} mb-3`}>
        Contrast Ratio
      </h2>
      <div className="flex justify-between items-center mb-4">
        <span
          ref={ratioRef}
          className={`text-3xl font-bold ${themeStyles.app.text}`}
        >
          {ratio}
        </span>
        <span
          className={`${color} font-medium text-base transition-colors duration-300`}
        >
          {text}
        </span>
      </div>
      <p
        className={`text-sm ${themeStyles.app.text} opacity-85 mb-2 transition-colors duration-300`}
      >
        {wcagLevel}
      </p>
      <p className="text-xs text-gray-400">
        Based on WCAG 2.1 contrast requirements
      </p>
    </div>
  );
}

export default ContrastRatio;
