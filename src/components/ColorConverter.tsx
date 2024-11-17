import React, { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { RGB } from "../types/colors";
import { hexToRgb, rgbToCmyk, rgbToHex } from "../utils/colorConverter";
import ColorCompositionChart from "./ColorCompositionChart";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Props {
  color?: string;
  onColorChange: (color: string) => void;
}

const initialRGB = { r: 255, g: 0, b: 0 };
const initialCMYK = { c: 0, m: 0, y: 0, k: 0 };
const initialChartData = [
  { name: "Cyan", value: 0 },
  { name: "Magenta", value: 0 },
  { name: "Yellow", value: 0 },
  { name: "Key (Black)", value: 0 },
];

const ColorConverter: React.FC<Props> = ({ color, onColorChange }) => {
  const [rgb, setRgb] = useState(initialRGB);
  const [cmyk, setCmyk] = useState<ReturnType<typeof rgbToCmyk>>(initialCMYK);
  const [totalValue, setTotalValue] = useState(0);
  const [chartData, setChartData] =
    useState<{ name: string; value: number }[]>(initialChartData);

  useEffect(() => {
    if (color) {
      const { r, g, b } = hexToRgb(color)!;
      setRgb({ r, g, b });
      updateCmykAndChart(r, g, b);
    }
  }, [color]);

  const handleChangeColor = (color: string) => {
    const { r, g, b } = hexToRgb(color)!;
    setRgb({ r, g, b });
    updateCmykAndChart(r, g, b);
    onColorChange(color);
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setRgb((prevRGB) => ({ ...prevRGB, [name]: parseInt(value, 10) }));
    updateCmykAndChart(rgb.r, rgb.g, rgb.b);
    onColorChange(rgbToHex(rgb.r, rgb.g, rgb.b));
  };

  const updateCmykAndChart = (r: number, g: number, b: number) => {
    const cmykResult = rgbToCmyk(r, g, b);
    setCmyk(cmykResult);

    // Normalize CMYK values to sum up to 100
    let totalValue = cmykResult.c + cmykResult.m + cmykResult.y + cmykResult.k;
    const normalizedCMYKValues = {
      c: Math.round((cmykResult.c * 100) / totalValue),
      m: Math.round((cmykResult.m * 100) / totalValue),
      y: Math.round((cmykResult.y * 100) / totalValue),
      k: Math.round((cmykResult.k * 100) / totalValue),
    };

    const chartDataResult = [
      { name: "Cyan", value: normalizedCMYKValues.c },
      { name: "Magenta", value: normalizedCMYKValues.m },
      { name: "Yellow", value: normalizedCMYKValues.y },
      { name: "Key (Black)", value: normalizedCMYKValues.k },
    ];
    setChartData(chartDataResult);
    setTotalValue(totalValue);
  };

  interface ColorInputProps<T extends keyof typeof rgb> {
    color: T;
  }

  const ColorInput = <T extends keyof typeof rgb>({
    color,
  }: ColorInputProps<T>) => (
    <div className="flex flex-col gap-y-2">
      <Label htmlFor={`input-${color}`}>{color}</Label>
      <Input
        id={`input-${color}`}
        key={`input-${color}`}
        type="number"
        name={color}
        value={rgb[color]}
        onChange={handleInputChange}
        min="0"
        max="255"
        className="bg-gray-100 border-none focus:ring-0 text-black rounded-md px-3 py-2 w-full"
      />
    </div>
  );

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
        <span>{`${Math.round(value)}%`}</span>
        <span>{`${isNaN(normalisedValue) ? 0 : normalisedValue}%`}</span>
      </li>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
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

      <div className="mt-4 space-y-3 flex items-center gap-x-3">
        <ColorCompositionChart chartData={chartData} />
        <div className="mt-4 space-y-3 flex-cols-2 gap-x-3 justify-items-center items-center">
          <HexColorPicker
            color={rgbToHex(rgb.r, rgb.g, rgb.b)}
            onChange={handleChangeColor}
          />

          <div className="grid grid-cols-3 gap-x-9 gap-y-5">
            {Object.keys(rgb).map((color) => (
              <ColorInput key={color} color={color as keyof RGB} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorConverter;
