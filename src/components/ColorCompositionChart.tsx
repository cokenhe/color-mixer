import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { cmykToHex } from "../utils/colorConverter";

const defaultChartColor = [
  `${cmykToHex({ c: 1, m: 0, y: 0, k: 0 })}`,
  `${cmykToHex({ c: 0, m: 1, y: 0, k: 0 })}`,
  `${cmykToHex({ c: 0, m: 0, y: 1, k: 0 })}`,
  `${cmykToHex({ c: 0, m: 0, y: 0, k: 1 })}`,
];

const ColorCompositionChart: React.FC<{
  chartData: any[];
  colors?: string[];
}> = ({ chartData, colors = defaultChartColor }) => (
  <PieChart width={400} height={300}>
    <Legend />
    <Tooltip formatter={(value) => `${value}%`} />
    <Pie dataKey="value" data={chartData} cx="50%" cy="50%">
      {chartData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={colors[index]} />
      ))}
    </Pie>
  </PieChart>
);

export default ColorCompositionChart;
