"use client";

import { Panel } from "reactflow";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./../../style-test.css";
import { MetricsData } from "./metricsData";
import { CircleChart } from "./circleChart";
import { ChartCard } from "./chartCard";

const data = [
  {
    name: 0,
    game1: 0,
    game2: 0,
    game3: 0,
    game4: 0,
    game5: 0,
  },
  {
    name: 1,
    game1: 10,
    game2: 5,
    game3: 5,
    game4: 2,
    game5: 10,
  },
  {
    name: 2,
    game1: 20,
    game2: 10,
    game3: 10,
    game4: 4,
    game5: 20,
  },
  {
    name: 3,
    game1: 30,
    game2: 15,
    game3: 15,
    game4: 9,
    game5: 20,
  },
  {
    name: 4,
    game1: 40,
    game2: 15,
    game3: 20,
    game4: 11,
    game5: 30,
  },
  {
    name: 5,
    game1: 50,
    game2: 15,
    game3: 25,
    game4: 13,
    game5: 40,
  },
  {
    name: 6,
    game1: 70,
    game2: 20,
    game3: 30,
    game4: 18,
    game5: 50,
  },
  {
    name: 7,
    game1: 90,
    game2: 25,
    game3: 25,
    game4: 28,
    game5: 60,
  },
  {
    name: 8,
    game1: 110,
    game2: 27,
    game3: 30,
    game4: 38,
    game5: 70,
  },
  {
    name: 9,
    game1: 130,
    game2: 37,
    game3: 25,
    game4: 48,
    game5: 80,
  },
  {
    name: 10,
    game1: 150,
    game2: 47,
    game3: 30,
    game4: 58,
    game5: 90,
  },
];

export const Metrics = () => {
  const { analytics, setAnalytics } = useChangeEdgeType();
  return (
    <Panel position="top-right" className="analytics_panel">
      <button
        className="bg-black rounded py-1 px-2 text-white absolute top-2 left-2"
        onClick={() => setAnalytics(false)} > &#x2716;
      </button>
      <h1 className="pt-2 text-center text-lg">
        <strong>Node statistics (wood)</strong>
      </h1>

      <h2 className="pt-1 pb-4 text-center">
        <strong>All games</strong>
      </h2>
      <small className="ml-10">
        <strong>Value</strong>
      </small>
      <LineChart width={400} height={230} data={data} className="mt-2">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {/* <Legend /> */}
        <Line type="monotone" dataKey="game1" stroke="#82ca9d" />
        <Line type="monotone" dataKey="game2" stroke="#8884d8" />
        <Line type="monotone" dataKey="game3" stroke="pink" />
        <Line type="monotone" dataKey="game4" stroke="blue" />
        <Line type="monotone" dataKey="game5" stroke="purple" />
      </LineChart>
      <small className="w-full flex justify-center items-center text-center m-0">
        <strong>Iterations</strong>
      </small>
      <MetricsData
        average={100}
        median={50}
        min={1}
        max={100}
        std={37}
        range={1}
      />
      <ChartCard data={data} gameCount={1} stroke="#82ca9d" dataKey="game1" percent={14}/>
      <ChartCard data={data} gameCount={2} stroke="#8884d8" dataKey="game2" percent={64}/>
      <ChartCard data={data} gameCount={3} stroke="pink" dataKey="game3" percent={92}/>
      <ChartCard data={data} gameCount={4} stroke="blue" dataKey="game4" percent={45}/>
      <ChartCard data={data} gameCount={5} stroke="purple" dataKey="game5" percent={80}/>
    </Panel>
  );
};
