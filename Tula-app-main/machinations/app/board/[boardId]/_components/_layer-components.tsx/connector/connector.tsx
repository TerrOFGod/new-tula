"use client";
import { ArrowLayer } from "@/app/types/canvas";
import { colorToCss } from "@/utils/canvas";

interface RectangleProps {
  id: string;
  layer: ArrowLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

const Connector = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: RectangleProps) => {
  const { x, y, width, height, fill } = layer;
  return (
    <svg>
      <line
        className="drop-shadow-md"
        onPointerDown={(e) => onPointerDown(e, id)}
        x1={x}
        y1={y + height / 2}
        x2={x + width}
        y2={y + height / 2}
        strokeWidth={2}
        stroke={selectionColor || "#000"}
      />
      {/* <rect
        className="drop-shadow-md"
        onPointerDown={(e) => onPointerDown(e, id)}
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
        x={0}
        y={height / 2}
        width={width - 3}
        height={2}
        strokeWidth={2}
        fill={fill ? colorToCss(fill) : "#000"}
        stroke={selectionColor || "#000"}
      /> */}
      <polygon
        className="drop-shadow-md"
        onPointerDown={(e) => onPointerDown(e, id)}
        points={`${x + width - 10},${y + height / 2 - 5} ${x + width - 10},${
          y + height / 2 + 5
        } ${x + width + 2},${y + height / 2}`}
        strokeWidth={1}
        fill={fill ? colorToCss(fill) : "#000"}
        stroke={selectionColor || "#000"}
      />
    </svg>
  );
};

export default Connector;
