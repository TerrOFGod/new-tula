import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { colorToCss } from "@/utils/canvas";
import { useMutation } from "@/liveblocks.config";
import { Color, NoteLayer } from "@/app/types/canvas";

const getContrastingTextColor = (color: Color) => {
  const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
  return luminance > 182 ? "black" : "white";
};

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.15;
  const fontSizeBasedOnHeight = height * scaleFactor;
  const fontSizeBasedOnWidth = width * scaleFactor;

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize);
};

interface NoteProps {
  id: string;
  layer: NoteLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Note = ({
  layer,
  onPointerDown,
  id,
  selectionColor,
}: NoteProps) => {
  const { x, y, width, height, fill, value } = layer;

  const updateValue = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get("layers");

    liveLayers.get(id)?.set("value", newValue);
  }, []);

  const handleContentChange = (e: ContentEditableEvent) => {
    updateValue(e.target.value);
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
        backgroundColor: fill ? colorToCss(fill) : "#000",
      }}
      className="shadow-md drop-shadow-xl"
    >
      <ContentEditable
        html={value || "Text"}
        onChange={handleContentChange}
        className="h-full w-full flex items-center justify-center text-center outline-none"
        style={{
          fontSize: calculateFontSize(width, height),
          color: fill ? getContrastingTextColor(fill) : "#000",
        }}
      />
    </foreignObject>
  );
};
