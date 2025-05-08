import { Field, Input, Label } from "@headlessui/react";
import { useState, useEffect, useRef } from "react";
import { animate } from "motion";
import { useStore } from "../store";
import { THEME } from "../constants/theme";
import {
  isValidColor,
  getFormatPlaceholder,
  hexToFormat,
  formatToHex,
} from "../utils/colorUtils";

interface ColorInputProps {
  label: string;
  colorValue: string;
  onColorChange: (color: string) => void;
}

function ColorInput({ label, colorValue, onColorChange }: ColorInputProps) {
  const { colorFormat, theme } = useStore();
  const themeStyles = THEME[theme];
  const errorRef = useRef<HTMLParagraphElement>(null);

  const [isValid, setIsValid] = useState(true);
  const [inputValue, setInputValue] = useState(colorValue);
  const [hexValue, setHexValue] = useState(() =>
    formatToHex(colorValue, colorFormat)
  );

  // Only animate error message when validity changes
  useEffect(() => {
    const errorElement = errorRef.current;
    if (!errorElement) return;

    if (isValid) {
      errorElement.style.display = "none";
    } else {
      errorElement.style.display = "block";
      animate(errorElement, { opacity: [0, 1] }, { duration: 0.2 });
    }
  }, [isValid]);

  // Update input when format or color changes
  useEffect(() => {
    setIsValid(isValidColor(colorValue, colorFormat));
    setInputValue(colorValue);
    setHexValue(formatToHex(colorValue, colorFormat));
  }, [colorFormat, colorValue]);

  function handleColorChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newColor = e.target.value;
    setInputValue(newColor);
    const valid = isValidColor(newColor, colorFormat);
    setIsValid(valid);
    if (valid) {
      onColorChange(newColor);
      setHexValue(formatToHex(newColor, colorFormat));
    }
  }

  function handleColorPickerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newHexColor = e.target.value;
    setHexValue(newHexColor);
    const formattedColor = hexToFormat(newHexColor, colorFormat);
    setInputValue(formattedColor);
    onColorChange(formattedColor);
    setIsValid(true);
  }

  const inputId = `${label.toLowerCase().replace(" ", "-")}`;
  const placeholder = getFormatPlaceholder(colorFormat);

  return (
    <div className="w-full">
      <Field className="w-full">
        <Label
          htmlFor={inputId}
          className={`text-xs font-medium ${themeStyles.app.text} block mb-1.5`}
        >
          {label}
        </Label>
        <div className="relative flex items-center gap-2">
          <div className="flex-grow">
            <Input
              id={inputId}
              className={`
                block w-full rounded-md border text-xs tracking-widest
                ${isValid ? "border-transparent" : "border-red-500"} 
                ${themeStyles.input.background} px-3 py-2
                ${themeStyles.input.text}
                focus:outline-none focus:ring-1 ${themeStyles.input.focus}
              `}
              value={inputValue}
              onChange={handleColorChange}
              placeholder={placeholder}
            />
            <p
              ref={errorRef}
              className="absolute text-xs text-red-500 mt-1 opacity-0 hidden"
            >
              Invalid {colorFormat.toUpperCase()} format
            </p>
          </div>

          {/* Color Picker */}
          <div className="relative">
            <input
              type="color"
              value={hexValue}
              onChange={handleColorPickerChange}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              aria-label={`Pick ${label} color`}
            />
            <div
              className={`w-8 h-8 rounded-md border ${themeStyles.app.border} overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition-transform`}
              style={{ backgroundColor: hexValue }}
            />
          </div>
        </div>
      </Field>
    </div>
  );
}

export default ColorInput;
