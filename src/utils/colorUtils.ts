// Convert hex to RGB
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Convert hex to RGB format
export function hexToRgbString(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "rgb(0, 0, 0)";
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

// Convert hex to RGBA format
export function hexToRgbaString(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "rgba(0, 0, 0, 1)";
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
}

// Convert hex to HSL format
export function hexToHslString(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "hsl(0, 0%, 0%)";

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h = Math.round(h * 60);
  }

  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `hsl(${h}, ${s}%, ${l}%)`;
}

// Convert color value based on format
export function convertColorFormat(
  color: string,
  targetFormat: string
): string {
  // Try to standardize color to hex first
  const hexColor = color.startsWith("#") ? color : `#${color}`;

  switch (targetFormat) {
    case "hex":
      return hexColor;
    case "rgb":
      return hexToRgbString(hexColor);
    case "rgba":
      return hexToRgbaString(hexColor);
    case "hsl":
      return hexToHslString(hexColor);
    default:
      return color;
  }
}

// Calculate relative luminance
function getLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;

  const { r, g, b } = rgb;
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Calculate contrast ratio according to WCAG guidelines
export function calculateContrastRatio(color1: string, color2: string): string {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);

  const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);

  return ratio.toFixed(2) + ":1";
}

// Validate hex color
export function isValidHexColor(color: string): boolean {
  return /^#?([a-f\d]{3}|[a-f\d]{6})$/i.test(color);
}

// Validate RGB color
export function isValidRgbColor(color: string): boolean {
  const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  if (!rgbRegex.test(color)) return false;

  const matches = color.match(rgbRegex);
  if (!matches) return false;

  // Check RGB values are in valid range (0-255)
  for (let i = 1; i <= 3; i++) {
    const value = parseInt(matches[i], 10);
    if (value < 0 || value > 255) return false;
  }

  return true;
}

// Validate RGBA color
export function isValidRgbaColor(color: string): boolean {
  const rgbaRegex =
    /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01]|0?\.\d+)\s*\)$/;
  if (!rgbaRegex.test(color)) return false;

  const matches = color.match(rgbaRegex);
  if (!matches) return false;

  // Check RGB values are in valid range (0-255)
  for (let i = 1; i <= 3; i++) {
    const value = parseInt(matches[i], 10);
    if (value < 0 || value > 255) return false;
  }

  // Check alpha is in valid range (0-1)
  const alpha = parseFloat(matches[4]);
  if (alpha < 0 || alpha > 1) return false;

  return true;
}

// Validate HSL color
export function isValidHslColor(color: string): boolean {
  const hslRegex = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;
  if (!hslRegex.test(color)) return false;

  const matches = color.match(hslRegex);
  if (!matches) return false;

  // Check H value (0-360)
  const h = parseInt(matches[1], 10);
  if (h < 0 || h > 360) return false;

  // Check S and L values (0-100%)
  for (let i = 2; i <= 3; i++) {
    const value = parseInt(matches[i], 10);
    if (value < 0 || value > 100) return false;
  }

  return true;
}

// Validate color based on format
export function isValidColor(color: string, format: string): boolean {
  switch (format) {
    case "hex":
      return isValidHexColor(color);
    case "rgb":
      return isValidRgbColor(color);
    case "rgba":
      return isValidRgbaColor(color);
    case "hsl":
      return isValidHslColor(color);
    default:
      return false;
  }
}

// Format examples for placeholder text
export function getFormatPlaceholder(format: string): string {
  switch (format) {
    case "hex":
      return "#ffffff";
    case "rgb":
      return "rgb(255, 255, 255)";
    case "rgba":
      return "rgba(255, 255, 255, 1.0)";
    case "hsl":
      return "hsl(0, 0%, 100%)";
    default:
      return "";
  }
}

// Convert any format to hex
export function formatToHex(color: string, format: string): string {
  // If already hex or starts with #, return it
  if (format === "hex" || color.startsWith("#")) {
    return color.startsWith("#") ? color : `#${color}`;
  }

  // Handle RGB format: rgb(255, 255, 255)
  if (format === "rgb") {
    const rgbMatch = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
  }

  // Handle RGBA format: rgba(255, 255, 255, 1.0)
  if (format === "rgba") {
    const rgbaMatch = color.match(
      /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([01]|0?\.\d+)\s*\)/
    );
    if (rgbaMatch) {
      const r = parseInt(rgbaMatch[1], 10);
      const g = parseInt(rgbaMatch[2], 10);
      const b = parseInt(rgbaMatch[3], 10);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
  }

  // Handle HSL format: hsl(0, 100%, 50%)
  if (format === "hsl") {
    const hslMatch = color.match(
      /hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/
    );
    if (hslMatch) {
      const h = parseInt(hslMatch[1], 10) / 360;
      const s = parseInt(hslMatch[2], 10) / 100;
      const l = parseInt(hslMatch[3], 10) / 100;

      let r, g, b;

      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      };

      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
  }

  // Fallback to black if format can't be parsed
  return "#000000";
}

// Convert hex to specified format
export function hexToFormat(hex: string, format: string): string {
  // Ensure hex is properly formatted
  if (!hex.startsWith("#")) {
    hex = `#${hex}`;
  }

  // If format is hex, return the hex value
  if (format === "hex") {
    return hex;
  }

  // Parse hex to RGB values
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return hex; // Return original if parsing fails
  }

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  // Convert to requested format
  switch (format) {
    case "rgb":
      return `rgb(${r}, ${g}, ${b})`;
    case "rgba":
      return `rgba(${r}, ${g}, ${b}, 1)`;
    case "hsl":
      // Convert RGB to HSL
      const rNorm = r / 255;
      const gNorm = g / 255;
      const bNorm = b / 255;

      const max = Math.max(rNorm, gNorm, bNorm);
      const min = Math.min(rNorm, gNorm, bNorm);
      let h = 0,
        s = 0,
        l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case rNorm:
            h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
            break;
          case gNorm:
            h = (bNorm - rNorm) / d + 2;
            break;
          case bNorm:
            h = (rNorm - gNorm) / d + 4;
            break;
        }

        h = Math.round(h * 60);
      }

      s = Math.round(s * 100);
      l = Math.round(l * 100);

      return `hsl(${h}, ${s}%, ${l}%)`;
    default:
      return hex;
  }
}
