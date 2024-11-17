import { CMYK } from "../types/colors";
import { diffError, isValid } from "./cmykHelper";

/**
 * Calculate the ratios of CMYK colors needed to mix the target color.
 * @param colors An array of CMYK colors to mix.
 * @param target The target CMYK color to be mixed.
 * @returns An array of ratios, one for each color in the input array.
 * @throws An error if the input colors or target color are invalid.
 */
export const calculateCMYKRatios = (
  colors: CMYK[],
  target: CMYK,
  tolerance = 0.0001,
  maxIterations = 1000,
  stepSize = 0.05
): { mixedColor: CMYK; ratios: number[]; error: number } => {
  const n = colors.length;

  if (n === 0) throw new Error("No colors provided.");

  // Validate input values
  if (!colors.every(isValid) || !isValid(target)) {
    throw new Error(
      `All CMYK values must be between 0 and 1, ${JSON.stringify(
        colors
      )} and ${JSON.stringify(target)} get`
    );
  }

  // Initialize ratios
  let ratios = new Array(n).fill(1 / n); // Start with equal ratios

  // Helper function: compute the resulting CMYK mix for given ratios
  const calculateMixedCMYK = (ratios: number[]): CMYK => {
    const result: CMYK = { c: 0, m: 0, y: 0, k: 0 };
    for (let i = 0; i < n; i++) {
      for (const j of Object.keys(result) as (keyof CMYK)[]) {
        result[j] += colors[i][j] * ratios[i];
      }
    }
    return result;
  };

  let lastError = Infinity; // Track the last error

  // Optimization loop
  for (let iter = 0; iter < maxIterations; iter++) {
    // Calculate the current mix and error
    const mixedColor = calculateMixedCMYK(ratios);
    const error = diffError(mixedColor, target);

    if (error < tolerance || Math.abs(lastError - error) < tolerance) {
      return { mixedColor, ratios: [...ratios], error };
    }

    lastError = error; // Update the last error

    // Adjust ratios to minimize the error
    const gradients = new Array(n).fill(0);

    // Calculate gradient for each ratio
    for (let i = 0; i < n; i++) {
      const tempRatios = [...ratios];
      tempRatios[i] += 0.01; // Small adjustment
      const newMixed = calculateMixedCMYK(tempRatios);
      gradients[i] = diffError(newMixed, target) - error;
    }

    // Update ratios using the gradient
    for (let i = 0; i < n; i++) {
      ratios[i] -= stepSize * gradients[i];
      ratios[i] = Math.max(0, ratios[i]); // Ensure non-negative ratios
    }

    // Normalize ratios to sum to 1
    const total = ratios.reduce((sum, r) => sum + r, 0);
    for (let i = 0; i < n; i++) {
      ratios[i] /= total;
    }
  }

  // Ensure the final result is calculated
  const finalMixedColor = calculateMixedCMYK(ratios);
  const finalError = diffError(finalMixedColor, target);

  return {
    mixedColor: finalMixedColor,
    ratios: [...ratios],
    error: finalError,
  };
};
