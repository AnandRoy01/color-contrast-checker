/**
 * Convert hex to RGB
 */
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  // Remove '#' if present
  hex = hex.replace(/^#/, "");

  // Handle shorthand format (e.g. #ABC)
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

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

/**
 * Convert HSL to RGB
 * h: 0-360, s: 0-100, l: 0-100
 */
export function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  // Convert HSL percentages to decimal
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Parse HSL string and return RGB values
 */
export function parseHSL(
  hslStr: string
): { r: number; g: number; b: number } | null {
  try {
    // Handle both hsl() and hsla() formats
    const isHSLA = hslStr.startsWith("hsla");
    const valuesMatch = hslStr.match(/\d+(\.\d+)?%?/g);

    if (!valuesMatch || valuesMatch.length < 3) {
      return null;
    }

    let h = parseFloat(valuesMatch[0]);
    let s = parseFloat(valuesMatch[1]);
    let l = parseFloat(valuesMatch[2]);

    // Handle percentage values
    if (valuesMatch[1].includes("%")) {
      s = parseFloat(valuesMatch[1]);
    } else {
      s = parseFloat(valuesMatch[1]) * 100;
    }

    if (valuesMatch[2].includes("%")) {
      l = parseFloat(valuesMatch[2]);
    } else {
      l = parseFloat(valuesMatch[2]) * 100;
    }

    return hslToRgb(h, s, l);
  } catch (e) {
    return null;
  }
}

/**
 * Convert any color format to RGB
 */
export function anyColorToRgb(
  color: string
): { r: number; g: number; b: number } | null {
  // Handle different color formats
  if (color.startsWith("#")) {
    return hexToRgb(color);
  } else if (color.startsWith("rgb")) {
    // Parse RGB(A) string like "rgb(255, 255, 255)" or "rgba(255, 255, 255, 1)"
    const values = color.match(/\d+(\.\d+)?/g);
    if (values && values.length >= 3) {
      return {
        r: parseInt(values[0], 10),
        g: parseInt(values[1], 10),
        b: parseInt(values[2], 10),
      };
    }
  } else if (color.startsWith("hsl")) {
    return parseHSL(color);
  }

  // Try to handle it as a hex color without # prefix
  if (/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(color)) {
    return hexToRgb("#" + color);
  }

  return null;
}

/**
 * Calculate the relative luminance of a color
 * Formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
 */
export function getLuminance(color: string): number {
  try {
    // Convert any color format to RGB
    const rgb = anyColorToRgb(color);
    if (!rgb) return 0;

    // Convert RGB to sRGB
    const srgb = [rgb.r, rgb.g, rgb.b].map((val) => {
      val = val / 255;
      return val <= 0.03928
        ? val / 12.92
        : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    // Calculate luminance
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  } catch (e) {
    return 0;
  }
}

/**
 * Calculate contrast ratio between two colors
 * Formula: (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter color
 */
export function calculateContrastRatio(color1: string, color2: string): string {
  try {
    // Calculate luminance directly from provided colors in any format
    const luminance1 = getLuminance(color1);
    const luminance2 = getLuminance(color2);

    // Determine lighter and darker colors
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);

    // Calculate ratio
    const ratio = (lighter + 0.05) / (darker + 0.05);

    // Format to 2 decimal places
    return ratio.toFixed(2) + ":1";
  } catch (e) {
    return "1:1"; // Default fallback
  }
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
