import { Node } from 'reactflow';

export interface NodeDetailsData {
  [key: string]: any;
}

export interface NodeDetailsPanelProps {
  isOpen: boolean;
  nodeId: string | null;
  nodeType: string | null;
  onClose: () => void;
}

export interface FieldComponentProps {
  data: NodeDetailsData;
  onChange: (key: string, value: any) => void;
  nodeId: string;
}

// Типы для вероятностных эффектов
export interface ProbabilisticEffect {
  id: string;
  effect: string;
  probability: number;
}

export interface ConverterProbEffect {
  id: string;
  conversionIn: number;
  conversionOut: number;
  probability: number;
}

// Тип для состояния (state)
export interface StateType {
  id: string;
  name: string;
  type: 'int' | 'enum' | 'list';
  range?: [number, number];
  enumValues?: string[];
  listType?: string;
}

// Тип для события (event)
export interface EventType {
  id: string;
  name: string;
  requires: string;
  effect: string;
  probabilisticEffects: ProbabilisticEffect[];
}