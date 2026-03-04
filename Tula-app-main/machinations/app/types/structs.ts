import { Node } from "reactflow";
import CustomEdge from "../test/[boardId]/_components/_structs/edgeComponents/custom-edge";
import CustomNode from "./../test/[boardId]/_components/_structs/custom-node";
import SourceNode from "../test/[boardId]/_components/_structs/nodeComponents/tulaNodes/sourceNode";
import PoolNode from "../test/[boardId]/_components/_structs/nodeComponents/tulaNodes/poolNode";
import ConsumerNode from "../test/[boardId]/_components/_structs/nodeComponents/tulaNodes/consumerNode";
import ConverterNode from "../test/[boardId]/_components/_structs/nodeComponents/tulaNodes/converterNode";
import GateNode from "../test/[boardId]/_components/_structs/nodeComponents/tulaNodes/gateNode";
import RandomNode from "../test/[boardId]/_components/_structs/nodeComponents/tulaNodes/randomNode";
import DelayNode from "../test/[boardId]/_components/_structs/nodeComponents/tulaNodes/delayNode";
import TriggerNode from "../test/[boardId]/_components/_structs/nodeComponents/tulaNodes/triggerNode";
import EndNode from "../test/[boardId]/_components/_structs/nodeComponents/tulaNodes/endNode";
import consumerNode from "../test/[boardId]/_components/_structs/nodeComponents/tulaNodes/consumerNode";
import EntityNode from "../test/[boardId]/_components/_structs/nodeComponents/specNodes/entityNode";
import EventNode from "../test/[boardId]/_components/_structs/nodeComponents/specNodes/eventNode";
import OperatorNode from "../test/[boardId]/_components/_structs/nodeComponents/specNodes/operatorNode";
import RuleNode from "../test/[boardId]/_components/_structs/nodeComponents/specNodes/ruleNode";
import StateNode from "../test/[boardId]/_components/_structs/nodeComponents/specNodes/stateNode";
import ConditionalEdge from "../test/[boardId]/_components/_structs/edgeComponents/conditional-edge";
import ProbabilisticEdge from "../test/[boardId]/_components/_structs/edgeComponents/probabilistic-edge";
import TriggerEdge from "../test/[boardId]/_components/_structs/edgeComponents/trigger-edge";
import ModifierEdge from "../test/[boardId]/_components/_structs/edgeComponents/modifier-edge";

enum StructType {
  Source = "Source",
  Pool = "Pool",
  Consumer = "Consumer",
  Converter = "Converter",
  Gate = "Gate",
  Random = "Random",
  Delay = "Delay",
  Trigger = "Trigger",
  End = "End",
    // Новые типы
  Entity = "Entity",
  State = "State",
  Event = "Event",
  Rule = "Rule",
  Operator = "Operator",
  
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

export type TriggerStruct = {
  id: number | string;
  type: StructType.End;
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
  | TriggerStruct
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
  triggerNode: TriggerNode,
  endNode: EndNode,
  entityNode: EntityNode,
  stateNode: StateNode,
  eventNode: EventNode,
  ruleNode: RuleNode,
  operatorNode: OperatorNode,
};
export const edgeTypes = {
  custom: CustomEdge,
  probabilistic: ProbabilisticEdge,
  conditional: ConditionalEdge,
  trigger: TriggerEdge,
  modifier: ModifierEdge,
};

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
