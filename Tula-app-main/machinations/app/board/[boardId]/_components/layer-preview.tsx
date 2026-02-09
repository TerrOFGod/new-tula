"use client";

import { memo } from "react";

import { colorToCss } from "@/utils/canvas";
import { useStorage } from "@/liveblocks.config";
import { LayerType } from "@/app/types/canvas";
import { Path } from "./_layer-components.tsx/path";
import { Rectangle } from "./_layer-components.tsx/rectangle";
import { Ellipse } from "./_layer-components.tsx/ellipse";
import { TextComponent } from "./_layer-components.tsx/text";
import { Note } from "./_layer-components.tsx/note";
import { Triangle } from "./_layer-components.tsx/triangle";
import Connector from "./_layer-components.tsx/connector/connector";

interface LayerPreviewProps {
  id: string;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

//отображение объектов на канвасе
export const LayerPreview = memo(
  ({ id, onLayerPointerDown, selectionColor }: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id));

    if (!layer) {
      return null;
    }

    switch (layer.type) {
      case LayerType.Path:
        return (
          <Path
            key={id}
            points={layer.points}
            onPointerDown={(e) => onLayerPointerDown(e, id)}
            x={layer.x}
            y={layer.y}
            fill={layer.fill ? colorToCss(layer.fill) : "#000"}
            stroke={selectionColor}
          />
        );
      case LayerType.Note:
        return (
          <Note
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Text:
        return (
          <TextComponent
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Ellipse:
        return (
          <Ellipse
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Rectangle:
        return (
          <Triangle
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
        case LayerType.Arrow:
          return (
            <Connector
              id={id}
              layer={layer}
              onPointerDown={onLayerPointerDown}
              selectionColor={selectionColor}
            />
          );
      default:
        console.warn("Unknown layer type");
        return null;
    }
  }
);

LayerPreview.displayName = "LayerPreview";
