/* eslint-disable @typescript-eslint/no-explicit-any */
// src/core/grammar/grammar.types.ts

export type TokenType =
| 'ENTITY' | 'STATE' | 'EVENT' | 'RULE'
| 'PROPERTY' | 'OPERATOR' | 'CONSTANT' | 'IDENTIFIER'
| 'LPAREN' | 'RPAREN' | 'LBRACE' | 'RBRACE'
| 'COMMA' | 'COLON' | 'SEMICOLON' | 'ASSIGN'
| 'TEMPORAL_OP' | 'PROBABILITY_OP' | 'LOGICAL_OP'
| 'COMPARISON_OP' | 'ARITHMETIC_OP'
| 'ENUM' | 'RANGE' | 'LIST' | 'FUNCTION' | 'STRING' | 'NUMBER';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export interface ASTNode {
  type: string;
  children?: ASTNode[];
  value?: any;
  location?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
}

export interface GrammarRule {
  name: string;
  pattern: string;
  handler: (tokens: Token[]) => ASTNode;
  priority?: number;
}