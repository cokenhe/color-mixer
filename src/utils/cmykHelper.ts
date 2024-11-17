import { CMYK } from "../types/colors";

export const toArray = (cmyk: CMYK): number[] => {
  return [cmyk.c, cmyk.m, cmyk.y, cmyk.k];
};

export const isValid = (cmyk: CMYK): boolean => {
  return toArray(cmyk).every((value) => value >= 0 && value <= 1);
};

export const normalize = (cmyk: CMYK, base: number = 1): CMYK => {
  const totalValue = cmyk.c + cmyk.m + cmyk.y + cmyk.k;
  return {
    c: (cmyk.c * base) / totalValue,
    m: (cmyk.m * base) / totalValue,
    y: (cmyk.y * base) / totalValue,
    k: (cmyk.k * base) / totalValue,
  };
};

export const diff = (cmyk1: CMYK, cmyk2: CMYK): CMYK => {
  return {
    c: Math.abs(cmyk1.c - cmyk2.c),
    m: Math.abs(cmyk1.m - cmyk2.m),
    y: Math.abs(cmyk1.y - cmyk2.y),
    k: Math.abs(cmyk1.k - cmyk2.k),
  };
};

export const sum = (cmyk1: CMYK, cmyk2: CMYK): CMYK => {
  return {
    c: Math.min(1, cmyk1.c + cmyk2.c),
    m: Math.min(1, cmyk1.m + cmyk2.m),
    y: Math.min(1, cmyk1.y + cmyk2.y),
    k: Math.min(1, cmyk1.k + cmyk2.k),
  };
};

export const diffError = (cmyk1: CMYK, cmyk2: CMYK): number => {
  return Object.values(diff(cmyk1, cmyk2)).reduce(
    (sum, value) => sum + value,
    0
  );
};

export const multiply = (cmyk1: CMYK, k: number): CMYK => {
  return {
    c: cmyk1.c * k,
    m: cmyk1.m * k,
    y: cmyk1.y * k,
    k: cmyk1.k * k,
  };
};
