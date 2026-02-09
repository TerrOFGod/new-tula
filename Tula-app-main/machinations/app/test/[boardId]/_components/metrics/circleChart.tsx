import React, { FC } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#82ca9d", "#8884d8"];

export const CircleChart: FC<{ value: number }> = ({ value }) => {
  const data = [
    { name: "Total amount of resources in the node", value: value },
    { name: "Remaining amount of resources", value: 100 - value },
  ];
  return (
    <div className="mb-3 mx-5">
      <h2 className="pt-1 pb-2 text-center">
        <strong>Resource allocation</strong>
      </h2>
      <PieChart width={400} height={300}>
        <Pie dataKey="value" data={data} fill="#8884d8" label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </div>
  );
};
