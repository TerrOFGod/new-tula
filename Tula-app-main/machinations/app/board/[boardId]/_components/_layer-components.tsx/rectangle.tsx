import { RectangleLayer } from "@/app/types/canvas";
import { colorToCss } from "@/utils/canvas";

interface RectangleProps {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Rectangle = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: RectangleProps) => {
  const { x, y, width, height, fill } = layer;

  return (
    // <rect
    //   className="drop-shadow-md"
    //   onPointerDown={(e) => onPointerDown(e, id)}
    //   style={{
    //     transform: `translate(${x}px, ${y}px)`,
    //   }}
    //   x={0}
    //   y={0}
    //   width={width}
    //   height={height}
    //   strokeWidth={1}
    //   fill={fill ? colorToCss(fill) : "#000"}
    //   stroke={selectionColor || "#000"}
    // />
    <svg>
      <rect
        className="drop-shadow-md"
        onPointerDown={(e) => onPointerDown(e, id)}
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
        x={0}
        y={0}
        width={width}
        height={height}
        strokeWidth={1}
        fill={fill ? colorToCss(fill) : "#000"}
        stroke={selectionColor || "#000"}
      />
      {/* <text
        x={x + width / 2} // x-координата центра текста
        y={y + height / 2} // y-координата центра текста
        dominantBaseline="middle" // Выравнивание текста по вертикали
        textAnchor="middle" // Выравнивание текста по горизонтали
        fill="#fff" // Цвет текста
        fontSize="16" // Размер шрифта
      >
        Ваш текст
      </text> */}
    </svg>
  );
};
