// a component which add input colors dynamicly( which could add and remove )) with color picker
// and preview the color with ColorCompositionChart

import React, { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { CMYK } from "../types/colors";
import { calculateCMYKRatios } from "../utils/cmykMixer";
import { cmykToHex, hexToCmyk } from "../utils/colorConverter";
import ColorCompositionChart from "./ColorCompositionChart";

const initalColor: CMYK = { c: 1, m: 0, y: 0, k: 0 };
const initialChartData = [
  { name: "Cyan", value: 0 },
  { name: "Magenta", value: 0 },
  { name: "Yellow", value: 0 },
  { name: "Key (Black)", value: 0 },
];

const ColorMixer: React.FC<{ target?: CMYK }> = ({ target = initalColor }) => {
  const [colors, setColors] = useState<CMYK[]>([initalColor]);
  const [targetColor, setTargetColor] = useState<CMYK>(target);
  const [chartData, setChartData] = useState(initialChartData);
  const [mixedColor, setMixedColor] = useState<CMYK>(initalColor);
  const [errorRate, setErrorRate] = useState(0);

  const handleColorChange = (index: number, color: CMYK) => {
    const updatedColors = [...colors];
    updatedColors[index] = color;
    setColors(updatedColors);
  };

  useEffect(() => {
    const { mixedColor, ratios, error } = calculateCMYKRatios(
      colors,
      targetColor
    );
    setChartData(
      ratios.map((ratio, index) => ({
        name: `${index + 1}`,
        value: Math.round(ratio * 100),
      }))
    );
    setMixedColor(mixedColor);
    setErrorRate(error);
  }, [colors, targetColor]);

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex justify-between mb-4">
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={() => setColors([...colors, { c: 0, m: 0, y: 0, k: 0 }])}
        >
          Add Color
        </button>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded"
          onClick={() => setColors(colors.slice(0, -1))}
          disabled={colors.length === 0}
        >
          Remove Color
        </button>
      </div>

      <div className="flex items-center gap-x-2">
        {colors.map((color, index) => (
          <div key={index} className="flex items-center gap-x-2">
            <HexColorPicker
              color={cmykToHex(color)}
              onChange={(color) => handleColorChange(index, hexToCmyk(color)!)}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-x-2">
        <HexColorPicker
          className="mt-4 mb-4 bg-gray-100 border-none focus:ring-0 text-black rounded-md px-3 py-2 w-full"
          color={cmykToHex(targetColor)}
          onChange={(color) => setTargetColor(hexToCmyk(color))}
        />
        <div
          className={`w-[200px] h-[200px] rounded-full border-2 border-black`}
          style={{ backgroundColor: cmykToHex(targetColor) }}
        />
        <div
          className={`w-[200px] h-[200px] rounded-full border-2 border-black`}
          style={{ backgroundColor: cmykToHex(mixedColor) }}
        />
        <span>{`Error: ${Math.round(errorRate * 100)} %`}</span>
      </div>
      <ColorCompositionChart
        chartData={chartData}
        colors={colors.map(cmykToHex)}
      />
    </div>
  );
};

export default ColorMixer;
