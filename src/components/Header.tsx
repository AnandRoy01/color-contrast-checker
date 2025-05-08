import { memo } from "react";
import { useStore } from "../store";

const Header = memo(() => {
  const resetColors = useStore((state) => state.resetColors);

  return (
    <header className="flex flex-col items-center justify-center py-6 border-b border-gray-700">
      <h1 className="text-2xl font-bold text-white">Color Contrast Checker</h1>
      <p className="text-gray-400 mt-2 text-center">
        Test color combinations for WCAG compliance
      </p>
      <button
        onClick={resetColors}
        className="mt-4 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Reset Colors
      </button>
    </header>
  );
});

Header.displayName = "Header";

export default Header;
