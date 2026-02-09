"use client";

import { FC } from "react";
import "./../../style-test.css";

interface MetricsDta {
  average: number;
  median: number;
  min: number;
  max: number;
  std?: number;
  range?: number;
}

export const MetricsData: FC<MetricsDta> = ({
  average,
  median,
  max,
  min,
  std,
  range,
}) => {
  return (
    <div className="values_analytics">
      <div className="analytics__title">
        <h2>
          <strong>Metrics</strong>
        </h2>
        <h2>
          <strong>Value</strong>
        </h2>
      </div>
      <hr />
      <div className="analytics__title">
        <h2>Average value (AVR)</h2>
        <h2>{average}</h2>
      </div>
      <div className="analytics__title">
        <h2>Median (MEDIAN)</h2>
        <h2>{median}</h2>
      </div>
      <div className="analytics__title">
        <h2>Minimum value (MIN)</h2>
        <h2>{min}</h2>
      </div>
      <div className="analytics__title">
        <h2>Maximum value (MAX)</h2>
        <h2>{max}</h2>
      </div>
      {std && (
        <div className="analytics__title">
          <h2>Standard Deviation (STD)</h2>
          <h2>{std}</h2>
        </div>
      )}
      {range && (
        <div className="analytics__title">
          <h2>Range (RANGE)</h2>
          <h2>{range}</h2>
        </div>
      )}
      <hr/>
    </div>
  );
};
