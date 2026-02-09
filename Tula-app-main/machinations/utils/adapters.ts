import { Node, Edge, MarkerType } from "reactflow";
import {
  TNodeValue,
  TEdgeValue,
  TEdgeMarkerEndValue,
} from "@/convex/validators/boardData";

export const toConvexNode = (node: Node): TNodeValue => ({
  id: node.id,
  type: node.type || "default",
  width: node.width || 50,
  height: node.height || 50,
  selected: node.selected || false,
  dragging: node.dragging || false,
  positionAbsolute: {
    x: node.positionAbsolute?.x || 0,
    y: node.positionAbsolute?.y || 0,
  },
  position: {
    x: node.position.x,
    y: node.position.y,
  },
  data: {
    label: node.data.label,
    struct: node.data.struct,
    name: node.data.name,
  },
});

export const toReactFlowNode = (node: TNodeValue): Node => ({
  id: node.id,
  type: node.type,
  position: node.position,
  width: node.width,
  height: node.height,
  data: {
    label: node.data.label,
    struct: node.data.struct,
    name: node.data.name,
  },
  // Остальные поля с дефолтными значениями
  selected: node.selected,
  dragging: node.dragging,
  positionAbsolute: node.positionAbsolute,
});

export const toConvexEdge = (edge: Edge): TEdgeValue => ({
  id: edge.id,
  source: edge.source,
  target: edge.target,
  type: edge.type || "default",
  animated: edge.animated || false,
  data: edge.data || 0,
  selected: edge.selected || false,
  markerEnd: edge.markerEnd as TEdgeMarkerEndValue,
});

export const toReactFlowEdge = (edge: TEdgeValue): Edge => ({
  id: edge.id,
  source: edge.source,
  target: edge.target,
  type: edge.type,
  animated: edge.animated,
  data: edge.data,
  selected: edge.selected,
  markerEnd: edge.markerEnd,
  // Для совместимости с React Flow
  sourceHandle: null,
  targetHandle: null,
});
