// src/components/HalfGauge.jsx
import React from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A83232"];

export default function HalfGauge({ label, value, max }) {
  const safeMax = max > 0 ? max : 1;
  const data = [
    { name: "Used", value },
    { name: "Remaining", value: safeMax - value },
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <h4>{label}</h4>
      <RadialBarChart
        width={200}
        height={200}
        cx={100}
        cy={100}
        innerRadius="70%"
        outerRadius="90%"
        barSize={20}
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <PolarAngleAxis type="number" domain={[0, safeMax]} tick={false} />
        <RadialBar
          minAngle={15}
          clockWise
          dataKey="value"
          cornerRadius={10}
          fill={COLORS[0]}
        />
      </RadialBarChart>
      <div style={{ marginTop: "-80px" }}>
        <strong>{value}</strong> / {safeMax}
      </div>
    </div>
  );
}
