import React, { useMemo } from "react";
import { HexColorPicker } from "react-colorful";
import { hexToCmyk, hexToRgb, rgbToHex } from "../utils/colorConverter";
import ColorCompositionChart from "./ColorCompositionChart";

import { useDebouncedCallback } from "use-debounce";

interface Props {
  color?: string;
  onColorChange: (color: string) => void;
}

const initialRGB = { r: 255, g: 0, b: 0 };
const initialCMYK = { c: 0, m: 0, y: 0, k: 0 };

const ColorConverter: React.FC<Props> = ({ color, onColorChange }) => {
  const onChange = useDebouncedCallback(onColorChange, 300);
  const { rgb, cmyk, totalValue, chartData } = useMemo(() => {
    const rgb = color ? hexToRgb(color)! : initialRGB;
    const cmyk = color ? hexToCmyk(color) : initialCMYK;
    const totalValue = cmyk.c + cmyk.m + cmyk.y + cmyk.k;
    const { c, m, y, k } = {
      c: Math.round((cmyk.c * 100) / totalValue),
      m: Math.round((cmyk.m * 100) / totalValue),
      y: Math.round((cmyk.y * 100) / totalValue),
      k: Math.round((cmyk.k * 100) / totalValue),
    };
    return {
      rgb,
      cmyk,
      totalValue,
      chartData: [
        { name: "C", value: c },
        { name: "M", value: m },
        { name: "Y", value: y },
        { name: "K", value: k },
      ],
    };
  }, [color]);

  const ListItem: React.FC<{
    name: string;
    value: number;
  }> = ({ name, value }) => {
    const normalisedValue = Math.round((value * 100) / totalValue);
    return (
      <li
        key={`${name}-${value}`}
        className="py-4 flex items-center justify-between gap-x-6 text-sm font-medium leading-6 text-black"
      >
        {name}
        <span>{`${isNaN(normalisedValue) ? 0 : normalisedValue}%`}</span>
      </li>
    );
  };

  return (
    <div className="max-w-full mx-auto p-4 space-y-6 md:max-w-none">
      <h1 className="text-xl font-semibold text-center">
        RGB to CMYK Converter
      </h1>

      <div className="mt-4 space-y-3">
        <ul role="list" className="-my-5 divide-y divide-gray-100">
          <ListItem name="Cyan" value={cmyk.c} />
          <ListItem name="Magenta" value={cmyk.m} />
          <ListItem name="Yellow" value={cmyk.y} />
          <ListItem name="Key (Black)" value={cmyk.k} />
        </ul>
      </div>

      <div className="mt-4 space-y-3 flex flex-col md:flex-row justify-center items-center gap-x-3">
        <ColorCompositionChart chartData={chartData} />

        <div className="mt-4 space-y-3 flex-cols-2 gap-x-3 justify-items-center items-center">
          <HexColorPicker
            color={rgbToHex(rgb.r, rgb.g, rgb.b)}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ColorConverter);
