"use client";

import { useAnimateScheme } from "@/app/store/use-animate-scheme";

export const Iterations = () => {
  const { iterationsCount, iterations } = useAnimateScheme();

  return (
    <div className="text-xs text-center px-2">
      <label>Iterations</label>
      <div className="flex gap-x-3 items-center">
        <div>{iterationsCount}</div>
        <div>/</div>
        <div>{iterations}</div>
      </div>
    </div>
  );
};
