"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { MetricsData } from "./metricsData";
import { CircleChart } from "./circleChart";

export const ChartCard = ({ data, gameCount, stroke, dataKey, percent}: any) => {
  return (
    <div>
      <h2 className="pt-2 pb-2 text-center">
        <strong>Game {gameCount}</strong>
      </h2>
      <small className="ml-10"><strong>Value</strong></small>
      <LineChart width={400} height={230} data={data} className="mt-4">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={dataKey} stroke={stroke} />
      </LineChart>
      <small className="w-full flex justify-center items-center text-center m-0">
       <strong>Iterations</strong>
      </small>
      <MetricsData average={100} median={50} min={1} max={100} />
      <CircleChart value={percent} />
    </div>
  );
};
