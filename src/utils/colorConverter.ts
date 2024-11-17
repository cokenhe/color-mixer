import { CMYK } from "../types/colors";

export const rgbToCmyk = (r: number, g: number, b: number): CMYK => {
  r /= 255;
  g /= 255;
  b /= 255;

  let k = Math.min(1 - r, 1 - g, 1 - b);
  let c = k === 1 ? 0 : (1 - r - k) / (1 - k);
  let m = k === 1 ? 0 : (1 - g - k) / (1 - k);
  let y = k === 1 ? 0 : (1 - b - k) / (1 - k);

  return { c, m, y, k };
};

export const cmykToHex = ({ c, m, y, k }: CMYK) => {
  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));
  return rgbToHex(r, g, b);
};

export const cmykToRgb = ({ c, m, y, k }: CMYK) => {
  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));
  return { r, g, b };
};

export const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const hexToCmyk = (hex: string): CMYK => {
  const { r, g, b } = hexToRgb(hex)!;
  return rgbToCmyk(r, g, b);
};
