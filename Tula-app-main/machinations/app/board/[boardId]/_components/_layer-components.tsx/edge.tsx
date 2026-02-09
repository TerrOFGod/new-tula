import { EllipseLayer } from "@/app/types/canvas";
import { colorToCss } from "@/utils/canvas";
import { CSSProperties } from "react";

interface EdgeProps {
  id: string;
  layer: EllipseLayer;
  sourceId: string,
  targetId: string,
  inputValue: string,
  animated?: () => void,
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
  style?: CSSProperties;
  deletable?: boolean;
  selected?: boolean;
}

export const Edge = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: EdgeProps) => {
  return (
    <ellipse
      className="drop-shadow-md"
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        transform: `translate(
          ${layer.x}px,
          ${layer.y}px
        )`,
      }}
      cx={layer.width / 2}
      cy={layer.height / 2}
      rx={layer.width / 2}
      ry={layer.height / 2}
      fill={layer.fill ? colorToCss(layer.fill) : "#000"}
      stroke={selectionColor || "transparent"}
      strokeWidth="1"
    />
  );
};
