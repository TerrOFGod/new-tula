"use client";

import { useAnimateScheme } from "@/app/store/use-animate-scheme";

export const Games = () => {
  const {  games, gamesCount } = useAnimateScheme();

  return (
    <div className="text-xs text-center px-2">
      <label>Games</label>
      <div className="flex gap-x-3 items-center">
        <div>{gamesCount}</div>
        <div>/</div>
        <div>{games}</div>
      </div>
    </div>
  );
};
