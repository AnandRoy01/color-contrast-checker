import { useStore } from "../store";
import { THEME } from "../constants/theme";

const formatOptions = [
  { value: "hex", label: "HEX" },
  { value: "rgb", label: "RGB" },
  { value: "rgba", label: "RGBA" },
  { value: "hsl", label: "HSL" },
];

function FormatSelector() {
  const { colorFormat, setColorFormat, theme } = useStore();
  const themeStyles = THEME[theme];

  return (
    <div>
      <label
        className={`text-sm ${themeStyles.app.text} font-medium block mb-2`}
      >
        Color Format
      </label>
      <div
        className={`flex gap-1.5 ${themeStyles.preview.section} p-1.5 rounded-lg`}
      >
        {formatOptions.map((option) => (
          <button
            key={option.value}
            className={`
              flex-1 py-2 px-3 rounded text-sm transition-all duration-200
              hover:scale-[1.03] active:scale-[0.97]
              ${
                colorFormat === option.value
                  ? themeStyles.button.primary + " text-white"
                  : themeStyles.app.text + " opacity-70 hover:opacity-100"
              }
            `}
            onClick={() => setColorFormat(option.value as any)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FormatSelector;
