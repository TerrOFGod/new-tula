import {
  TBoardSnapshotDataValue,
  TEdgeValue,
  TNodeValue,
} from "@/convex/validators/boardData";

export type BoardElement =
  | {
      id: string;
      element_type: "node";
      type: string;
      struct: string;
      label: string | null;
      position: { data: { x: number; y: number } };
    }
  | {
      id: string;
      element_type: "edge";
      source_id: string;
      target_id: string;
      value: string | number;
    };

export interface BoardExportPayload {
  description: string;
  edge_type: string;
  iteration_counts: number;
  time_step: number;
  games_count: number;
  elements: BoardElement[];
}

const nodeToElement = (node: TNodeValue): BoardElement => ({
  id: node.id,
  element_type: "node",
  type: node.type,
  struct: node.data.struct.toLowerCase(),
  label: node.data.name ? node.data.name.toLowerCase() : null,
  position: {
    data: {
      x: node.position.x,
      y: node.position.y,
    },
  },
});

const edgeToElement = (edge: TEdgeValue): BoardElement => ({
  id: edge.id,
  element_type: "edge",
  source_id: edge.source,
  target_id: edge.target,
  value: edge.data,
});

export const buildBoardExportPayload = (
  state: TBoardSnapshotDataValue & {
    description?: string;
    edgesType?: string;
  },
  options?: {
    iterationCounts?: number;
    timeStep?: number;
    gamesCount?: number;
  }
): BoardExportPayload => ({
  description: state.description ?? "",
  edge_type: (state.edgesType ?? "Default").toLowerCase(),
  iteration_counts: options?.iterationCounts ?? 1,
  time_step: options?.timeStep ?? 1,
  games_count: options?.gamesCount ?? 1,
  elements: [
    ...state.nodes.map(nodeToElement),
    ...state.edges.map(edgeToElement),
  ],
});
