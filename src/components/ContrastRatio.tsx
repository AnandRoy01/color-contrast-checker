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
  // Make sure we're parsing the string ratio correctly
  const numericRatio = parseFloat(ratio.split(":")[0]);

  // Correct WCAG thresholds
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

  useEffect(() => {
    if (ratioRef.current) {
      animate(
        ratioRef.current,
        { scale: [1, 1.05, 1] },
        { duration: 0.3, easing: "ease-in-out" }
      );
    }
  }, [ratio]);

  return (
    <div className={`p-4 ${themeStyles.preview.section} rounded-xl`}>
      <h2 className={`text-sm font-medium ${themeStyles.app.text} mb-2`}>
        Contrast Ratio
      </h2>
      <div className="flex justify-between items-center mb-2">
        <span
          ref={ratioRef}
          className={`text-xl font-bold ${themeStyles.app.text}`}
        >
          {ratio}
        </span>
        <span
          className={`${color} font-medium text-sm transition-colors duration-300`}
        >
          {text}
        </span>
      </div>
      <p
        className={`text-xs ${themeStyles.app.text} opacity-85 mb-1 transition-colors duration-300`}
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
