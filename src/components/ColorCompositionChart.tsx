import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
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
  <ResponsiveContainer width="100%" height={300} minWidth={240}>
    <PieChart>
      <Legend />
      <Tooltip formatter={(value) => `${value}%`} />
      <Pie
        dataKey="value"
        data={chartData}
        cx="50%"
        cy="50%"
        isAnimationActive={false}
      >
        {chartData.map((_, index) => (
          <Cell key={`cell-${index}`} fill={colors[index]} />
        ))}
      </Pie>
    </PieChart>
  </ResponsiveContainer>
);

export default ColorCompositionChart;
