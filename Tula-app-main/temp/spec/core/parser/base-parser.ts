// src/core/parser/base-parser.ts

import { Injectable } from '@nestjs/common';
import { Token, ASTNode } from '../grammar/grammar.types';
import { TOKEN_PATTERNS } from '../grammar/grammar.definitions';

@Injectable()
export class BaseParser {
  protected tokens: Token[] = [];
  protected currentIndex = 0;
  protected ast: ASTNode = { type: 'Program', children: [] };

  tokenize(source: string): Token[] {
    const tokens: Token[] = [];
    let line = 1;
    let column = 1;
    let i = 0;

    while (i < source.length) {
      let matched = false;

      // Skip whitespace
      const whitespaceMatch = source.slice(i).match(/^\s+/);
      if (whitespaceMatch) {
        const newlines = whitespaceMatch[0].match(/\n/g);
        if (newlines) {
          line += newlines.length;
          column = newlines.length > 0 ? 1 : column + whitespaceMatch[0].length;
        } else {
          column += whitespaceMatch[0].length;
        }
        i += whitespaceMatch[0].length;
        continue;
      }

      // Skip comments
      const commentMatch = source.slice(i).match(/^\/\/[^\n]*/);
      if (commentMatch) {
        i += commentMatch[0].length;
        column += commentMatch[0].length;
        continue;
      }

      // Multi-line comments
      const multiCommentMatch = source.slice(i).match(/^\/\*[\s\S]*?\*\//);
      if (multiCommentMatch) {
        const newlines = multiCommentMatch[0].match(/\n/g);
        if (newlines) {
          line += newlines.length;
          column = multiCommentMatch[0].length - (multiCommentMatch[0].lastIndexOf('\n') + 1);
        } else {
          column += multiCommentMatch[0].length;
        }
        i += multiCommentMatch[0].length;
        continue;
      }

      // Match tokens
      for (const [type, pattern] of Object.entries(TOKEN_PATTERNS)) {
        const match = source.slice(i).match(pattern);
        if (match && match.index === 0) {
          const value = match[0];
          tokens.push({
            type: type as any,
            value,
            line,
            column
          });

          const newlines = value.match(/\n/g);
          if (newlines) {
            line += newlines.length;
            column = value.length - (value.lastIndexOf('\n') + 1);
          } else {
            column += value.length;
          }

          i += value.length;
          matched = true;
          break;
        }
      }

      if (!matched) {
        throw new Error(`Unexpected character at line ${line}, column ${column}: ${source[i]}`);
      }
    }

    return tokens;
  }

  protected peek(offset = 0): Token | null {
    return this.tokens[this.currentIndex + offset] || null;
  }

  protected consume(expectedType?: string): Token {
    const token = this.tokens[this.currentIndex];
    if (!token) {
      throw new Error('Unexpected end of input');
    }
    if (expectedType && token.type !== expectedType) {
      throw new Error(`Expected ${expectedType}, got ${token.type}`);
    }
    this.currentIndex++;
    return token;
  }

  protected match(type: string): boolean {
    const token = this.peek();
    return token?.type === type;
  }

  protected parseUntil(terminator: string): any[] {
    const results = [];
    while (this.peek() && this.peek()!.value !== terminator) {
      results.push(this.parseExpression());
    }
    this.consume(); // consume terminator
    return results;
  }

  protected parseExpression(): any {
    const token = this.peek();
    if (!token) return null;

    // Handle temporal operators
    if (token.value === 'G' || token.value === 'F' || token.value === 'X') {
      return this.parseTemporalExpression();
    }

    // Handle probability expressions
    if (token.value === 'P' && this.peek(1)?.value === '[') {
      return this.parseProbabilityExpression();
    }

    // Handle logical expressions
    if (token.value === '(') {
      this.consume('(');
      const expr = this.parseExpression();
      this.consume(')');
      return expr;
    }

    return this.parsePrimary();
  }

  protected parseTemporalExpression(): any {
    const operator = this.consume().value;
    this.consume('(');
    const expression = this.parseExpression();
    this.consume(')');
    
    return {
      type: 'TemporalExpression',
      operator,
      expression
    };
  }

  protected parseProbabilityExpression(): any {
    this.consume('P');
    this.consume('[');
    const expression = this.parseExpression();
    this.consume(']');
    
    let operator = '=';
    let threshold = 0;
    
    if (this.match('OPERATOR')) {
      operator = this.consume().value;
      threshold = parseFloat(this.consume('NUMBER').value);
    }
    
    return {
      type: 'ProbabilityExpression',
      expression,
      operator,
      threshold
    };
  }

  protected parsePrimary(): any {
    const token = this.consume();
    
    if (token.type === 'NUMBER') {
      return { type: 'Literal', value: parseFloat(token.value) };
    }
    if (token.type === 'STRING') {
      return { type: 'Literal', value: token.value.slice(1, -1) };
    }
    if (token.type === 'IDENTIFIER') {
      // Check if it's a property access
      if (this.match('.')) {
        this.consume('.');
        const property = this.consume('IDENTIFIER');
        return {
          type: 'PropertyAccess',
          object: token.value,
          property: property.value
        };
      }
      // Check if it's a function call
      if (this.match('(')) {
        return this.parseFunctionCall(token.value);
      }
      return { type: 'Identifier', value: token.value };
    }
    
    return { type: 'Unknown', value: token.value };
  }

  protected parseFunctionCall(name: string): any {
    this.consume('(');
    const args = [];
    while (!this.match(')')) {
      args.push(this.parseExpression());
      if (this.match(',')) this.consume(',');
    }
    this.consume(')');
    
    return {
      type: 'FunctionCall',
      name,
      arguments: args
    };
  }
}