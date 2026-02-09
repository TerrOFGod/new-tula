"use client";

import { useOther } from "@/liveblocks.config";
import { MousePointer2 } from "lucide-react";
import { memo } from "react";

interface CursorProps {
  connectionId: number;
}

export const Cursor = memo(({ connectionId }: CursorProps) => {
  const info = useOther(connectionId, (user) => user?.info);
  const cursor = useOther(connectionId, (user) => user.presence.cursor);

  if (!cursor) {
    return null;
  }
  const { x, y } = cursor;
  const name = info?.name || "No name";

  return (
    <foreignObject
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
      width={name.length * 10 + 24}
      height="50"
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <MousePointer2
        className="h-5 w-5"
        style={{
          fill: "red",
          color: "red",
        }}
      />
      <div
        className="absolute left-5 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold"
        style={{ backgroundColor: "red" }}
      >
        {name}
      </div>
    </foreignObject>
  );
});

Cursor.displayName = "Cursor";
