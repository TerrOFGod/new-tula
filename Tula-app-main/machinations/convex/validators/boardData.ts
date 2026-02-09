import { Infer, v } from "convex/values";
import { MarkerType } from "reactflow";

export const boardEdgesTypeValue = v.union(
  v.literal("Default"),
  v.literal("SmoothStep"),
  v.literal("Bezier")
);

const boardHistoryTypeValue = v.union(
  v.literal("snapshot"),
  v.literal("patch")
);

const positionConvexValue = v.object({
  x: v.number(),
  y: v.number(),
});

const nodeDataConvexValue = v.object({
  label: v.union(v.string(), v.number()),
  struct: v.string(),
  name: v.string(),
});

const nodeConvexValue = v.object({
  id: v.string(),
  type: v.string(),
  width: v.number(),
  height: v.number(),
  selected: v.boolean(),
  dragging: v.boolean(),
  positionAbsolute: positionConvexValue,
  position: positionConvexValue,
  data: nodeDataConvexValue,
});

const edgeMarkerEndConvexValue = v.object({
  type: v.union(v.literal(MarkerType.Arrow), v.literal(MarkerType.ArrowClosed)),
  width: v.number(),
  height: v.number(),
  color: v.string(),
});

const edgeConvexValue = v.object({
  source: v.string(),
  target: v.string(),
  id: v.string(),
  type: v.string(),
  animated: v.boolean(),
  data: v.union(v.number(), v.float64(), v.string()),
  selected: v.boolean(),
  markerEnd: v.optional(v.union(v.string(), edgeMarkerEndConvexValue)),
});

const boardDataSnapshotConvexValue = v.object({
  nodes: v.array(nodeConvexValue),
  edges: v.array(edgeConvexValue),
  // layerIds: v.array(v.string()),
  // layers: layersConvexRecord,
});

// const layersFillConvexValue = v.object({
//   r: v.number(),
//   g: v.number(),
//   b: v.number(),
// });

// const layersConvexValue = v.object({
//   type: v.number(),
//   x: v.number(),
//   y: v.number(),
//   height: v.number(),
//   width: v.number(),
//   fill: layersFillConvexValue,
// });

// const layersConvexRecord = v.record(v.string(), layersConvexValue);

const patchesOperationUnionValue = v.union(
  v.literal("add"),
  v.literal("remove"),
  v.literal("replace")
);

const patchConvexValue = v.object({
  op: v.union(v.literal("add"), v.literal("remove"), v.literal("replace")),
  path: v.string(),
  value: v.optional(v.any()),
  oldValue: v.optional(v.any()),
});

const boardDataPatchConvexValue = v.object({
  patches: v.array(patchConvexValue),
  base: v.number(), // Базовый снэпшот
});

const boardHistoryDataValue = v.union(
  boardDataSnapshotConvexValue,
  boardDataPatchConvexValue
);

export {
  boardHistoryTypeValue,
  boardHistoryDataValue,
  boardDataSnapshotConvexValue,
  boardDataPatchConvexValue,
};

export type TBoardEdgesType = Infer<typeof boardEdgesTypeValue>;
export type TBoardHistoryRecordType = Infer<typeof boardHistoryTypeValue>;
export type TBoardHistoryRecordData = Infer<typeof boardHistoryDataValue>;

// Типы для данных доски
export type TPositionValue = Infer<typeof positionConvexValue>;
export type TNodeDataValue = Infer<typeof nodeDataConvexValue>;
export type TNodeValue = Infer<typeof nodeConvexValue>;
export type TEdgeMarkerEndValue = Infer<typeof edgeMarkerEndConvexValue>;
export type TEdgeValue = Infer<typeof edgeConvexValue>;
// export type TLayersFillValue = Infer<typeof layersFillConvexValue>;
// export type TLayerValueValue = Infer<typeof layersConvexValue>;
// export type TLayersValue = Infer<typeof layersConvexRecord>;

// Типы для операций патчей
export type TPatchOperationValue = Infer<typeof patchesOperationUnionValue>;
export type TPatchValue = Infer<typeof patchConvexValue>;

// Типы для данных записи в истории
export type TBoardSnapshotDataValue = Infer<
  typeof boardDataSnapshotConvexValue
>;
export type TBoardPatchDataValue = Infer<typeof boardDataPatchConvexValue>;
