import { Node, Edge } from "reactflow";

export type BoardState = {
  title: string;
  description: string;
  edgesType: string;
  nodes: Node[];
  edges: Edge[];
  version: number;
  createdAt: number;
};

export type PreviousState = Omit<
  BoardState,
  "title" | "description" | "edgesType"
>;

export type BoardStateData = Omit<PreviousState, "version" | "createdAt">;

export enum BoardSavingStatus {
  IDLE = "idle",
  SAVING = "saving",
  ERROR = "error",
}
