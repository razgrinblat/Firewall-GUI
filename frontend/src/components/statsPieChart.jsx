// frontend/src/components/StatsPieChart.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A83232",
  "#6A5ACD",
  "#FF69B4",
  "#FF7F50",
  "#2E8B57",
  "#DAA520",
  "#BDB76B",
  "#9932CC",
];

function StatsPieChart({ data }) {
  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}

export default StatsPieChart;
