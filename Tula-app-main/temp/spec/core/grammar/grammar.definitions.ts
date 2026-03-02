// src/core/grammar/grammar.definitions.ts

import { GrammarRule } from './grammar.types';

export const GRAMMAR_RULES: GrammarRule[] = [
  // Entity definition
  {
    name: 'EntityDefinition',
    pattern: 'entity {identifier} { {content} }',
    handler: (tokens) => ({
      type: 'Entity',
      name: tokens[1].value,
      content: tokens[3].value
    })
  },
  // State definition
  {
    name: 'StateDefinition',
    pattern: 'State { {properties} }',
    handler: (tokens) => ({
      type: 'State',
      properties: tokens[2].value
    })
  },
  // Property definition
  {
    name: 'PropertyDefinition',
    pattern: '{identifier} : {type_definition}',
    handler: (tokens) => ({
      type: 'Property',
      name: tokens[0].value,
      definition: tokens[2].value
    })
  },
  // Type definitions
  {
    name: 'EnumType',
    pattern: 'Enum ( {values} )',
    handler: (tokens) => ({
      type: 'Enum',
      values: tokens[2].value.split(',').map(v => v.trim())
    })
  },
  {
    name: 'RangeType',
    pattern: '{type} [ {min} , {max} ]',
    handler: (tokens) => ({
      type: 'Range',
      baseType: tokens[0].value,
      min: parseInt(tokens[2].value),
      max: parseInt(tokens[4].value)
    })
  },
  // Event definition
  {
    name: 'EventDefinition',
    pattern: 'Event {identifier} { {clauses} }',
    handler: (tokens) => ({
      type: 'Event',
      name: tokens[1].value,
      clauses: tokens[3].value
    })
  },
  // Rule definition
  {
    name: 'RuleDefinition',
    pattern: 'Rule {identifier} { {clauses} }',
    handler: (tokens) => ({
      type: 'Rule',
      name: tokens[1].value,
      clauses: tokens[3].value
    })
  },
  // Temporal operators
  {
    name: 'TemporalOperator',
    pattern: '{temporal_op} ( {expression} )',
    handler: (tokens) => ({
      type: 'TemporalExpression',
      operator: tokens[0].value,
      expression: tokens[2].value
    })
  },
  // Probability expressions
  {
    name: 'ProbabilityExpression',
    pattern: 'P [ {expression} ] {comparison_op} {number}',
    handler: (tokens) => ({
      type: 'ProbabilityExpression',
      expression: tokens[1].value,
      operator: tokens[2].value,
      threshold: parseFloat(tokens[3].value)
    })
  }
];

export const TOKEN_PATTERNS = {
  IDENTIFIER: /[a-zA-Z_][a-zA-Z0-9_]*/,
  NUMBER: /[0-9]+(?:\.[0-9]+)?/,
  STRING: /"[^"]*"|'[^']*'/,
  OPERATOR: /[+\-*/=<>!&|^~%]+/,
  WHITESPACE: /\s+/,
  COMMENT: /\/\/[^\n]*|\/\*[\s\S]*?\*\//,
  PUNCTUATION: /[(){}\[\];,:.]/
};