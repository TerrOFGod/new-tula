import { Node } from "reactflow";
import CustomEdge from "../test/[boardId]/_components/_structs/custom-edge";
import CustomNode from "./../test/[boardId]/_components/_structs/custom-node";
import SourceNode from "./../test/[boardId]/_components/_structs/nodeComponents/sourceNode";
import PoolNode from "./../test/[boardId]/_components/_structs/nodeComponents/poolNode";
import ConsumerNode from "./../test/[boardId]/_components/_structs/nodeComponents/consumerNode";
import ConverterNode from "./../test/[boardId]/_components/_structs/nodeComponents/converterNode";
import GateNode from "./../test/[boardId]/_components/_structs/nodeComponents/gateNode";
import RandomNode from "./../test/[boardId]/_components/_structs/nodeComponents/randomNode";
import DelayNode from "./../test/[boardId]/_components/_structs/nodeComponents/delayNode";
import EndNode from "./../test/[boardId]/_components/_structs/nodeComponents/endNode";
import consumerNode from "./../test/[boardId]/_components/_structs/nodeComponents/consumerNode";

enum StructType {
  Source = "Source",
  Pool = "Pool",
  Consumer = "Consumer",
  Converter = "Converter",
  Gate = "Gate",
  Random = "Random",
  Delay = "Delay",
  End = "End",
}
export { StructType };

export enum EdgesTypes {
  DEFAULT = "Default",
  SMOOTH_STEP = "SmoothStep",
  BEZIER = "Bezier",
}

export type SourceStruct = {
  id: number | string;
  type: StructType.Source;
  value?: string;
};

export type PoolStruct = {
  id: number | string;
  type: StructType.Pool;
  value?: string;
};

export type ConsumerStruct = {
  id: number | string;
  type: StructType.Consumer;
  value?: string;
};

export type ConverterStruct = {
  id: number | string;
  type: StructType.Converter;
  value?: string;
};

export type GateStruct = {
  id: number | string;
  type: StructType.Gate;
  value?: string;
};

export type RandomStruct = {
  id: number | string;
  type: StructType.Random;
  value?: string;
};

export type DelayStruct = {
  id: number | string;
  type: StructType.Delay;
  value?: string;
};

export type EndStruct = {
  id: number | string;
  type: StructType.End;
  value?: string;
};

export type Structs =
  | SourceStruct
  | PoolStruct
  | ConsumerStruct
  | ConverterStruct
  | GateStruct
  | RandomStruct
  | DelayStruct
  | EndStruct;

export const nodeTypes = {
  textUpdater: CustomNode,
  sourceNode: SourceNode,
  poolNode: PoolNode,
  consumerNode: ConsumerNode,
  converterNode: ConverterNode,
  gateNode: GateNode,
  randomNode: RandomNode,
  delayNode: DelayNode,
  endNode: EndNode,
};
export const edgeTypes = { custom: CustomEdge };

export interface Graph {
  id: number;
  countComponents: number;
  owner: string;
  created: string;
  modified: string;
  title: string;
  description: string;
}

export interface CustomNode extends Node {
  sourceStruct: SourceStruct;
  name: string;
  value: string;
}
