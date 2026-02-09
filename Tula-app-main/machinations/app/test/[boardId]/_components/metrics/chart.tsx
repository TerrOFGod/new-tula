"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";

export const Chart = ({ data, title }: any) => {
  return (
    <div>
      <h2 className="pt-2 pb-4 text-center">{title}</h2>
      <AreaChart
        width={350}
        height={220}
        data={data[0]}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="iteration" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="iterations1"
          stroke="red"
          fillOpacity={1}
          fill="url(#colorXv)"
        />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="purple"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="pink"
          fillOpacity={1}
          fill="url(#colorXv)"
        />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="blue"
          fillOpacity={1}
          fill="url(#colorXv)"
        />
      </AreaChart>
    </div>
  );
};
