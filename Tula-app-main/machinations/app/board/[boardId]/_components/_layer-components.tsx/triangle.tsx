import { RectangleLayer } from "@/app/types/canvas";
import { colorToCss } from "@/utils/canvas";

interface TriangleProps {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Triangle = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: TriangleProps) => {
  const { x, y, width, height, fill } = layer;

  return (
    <>
      <svg>
        <polygon
          className="drop-shadow-md"
          onPointerDown={(e) => onPointerDown(e, id)}
          points={`${x},${y + height} ${x + width},${y + height} ${
            x + width / 2
          },${y}`}
          // points={`${x},${y} ${x + width},${y} ${x + width / 2},${y + height}`}
          strokeWidth={1}
          fill={fill ? colorToCss(fill) : "#000"}
          stroke={selectionColor || "#000"}
        />
        {/* Добавление текста внутри треугольника  */}
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          фывыфвфыв
        </text>
        <text
          x={x + width / 2}
          y={y + height + 15}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          еще текст
        </text>
      </svg>
    </>
  );
};
