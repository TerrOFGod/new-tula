export type ASTNodeType =
  | 'Program'
  | 'Entity'
  | 'State'
  | 'Event'
  | 'Rule'
  | 'Property'
  | 'EnumType'
  | 'RangeType'
  | 'ListType'
  | 'TemporalExpression'
  | 'ProbabilityExpression'
  | 'FunctionCall'
  | 'Literal'
  | 'Identifier'
  | 'PropertyAccess';

export interface ASTNode {
  type: ASTNodeType;
  [key: string]: any;
}

export interface EntityNode extends ASTNode {
  type: 'Entity';
  name: string;
  states: StateNode[];
  events: EventNode[];
}

export interface StateNode extends ASTNode {
  type: 'State';
  properties: PropertyNode[];
}

export interface PropertyNode extends ASTNode {
  type: 'Property';
  name: string;
  definition: TypeDefinition;
}

export interface TypeDefinition {
  type: 'enum' | 'int_range' | 'list' | 'int' | 'float' | 'bool' | 'string';
  values?: string[];
  min?: number;
  max?: number;
  elementType?: string;
  default?: any;
}

export interface EventNode extends ASTNode {
  type: 'Event';
  name: string;
  clauses: {
    requires?: string;
    target?: string;
    effect?: string;
    probabilityEffects?: Array<{ effect: string; probability: number }>;
  };
}

export interface RuleNode extends ASTNode {
  type: 'Rule';
  name: string;
  when?: string;
  effect?: string;
  temporalOperators?: Array<{ operator: string; expression: string }>;
  probabilityConstraints?: Array<{ expression: string; operator: string; threshold: number }>;
}