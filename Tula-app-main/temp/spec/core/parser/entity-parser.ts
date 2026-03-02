// src/core/parser/entity-parser.ts

import { Injectable } from '@nestjs/common';
import { BaseParser } from './base-parser';
import { ASTNode } from '../grammar/grammar.types';

@Injectable()
export class EntityParser extends BaseParser {
  parseEntity(source: string): ASTNode {
    this.tokens = this.tokenize(source);
    this.currentIndex = 0;
    
    return this.parseEntityDefinition();
  }

  private parseEntityDefinition(): ASTNode {
    const entityNode: ASTNode = {
      type: 'Entity',
      name: '',
      states: [],
      events: []
    };

    // Parse entity name
    if (this.match('ENTITY')) {
      this.consume('ENTITY'); // Skip 'Entity' keyword
      entityNode.name = this.consume('IDENTIFIER').value;
    }

    this.consume('{');

    // Parse entity content
    while (!this.match('}')) {
      if (this.match('STATE')) {
        entityNode.states = this.parseStateDefinition();
      } else if (this.match('EVENT')) {
        entityNode.events.push(this.parseEventDefinition());
      } else {
        // Skip unknown tokens
        this.consume();
      }
    }

    this.consume('}');
    return entityNode;
  }

  private parseStateDefinition(): any[] {
    const states = [];
    
    this.consume('STATE');
    this.consume('{');
    
    while (!this.match('}')) {
      const state = this.parsePropertyDefinition();
      states.push(state);
      if (this.match(';')) this.consume(';');
    }
    
    this.consume('}');
    return states;
  }

  private parsePropertyDefinition(): any {
    const name = this.consume('IDENTIFIER').value;
    this.consume(':');
    const typeDef = this.parseTypeDefinition();
    
    return {
      name,
      type: typeDef.type,
      ...typeDef.properties
    };
  }

  private parseTypeDefinition(): any {
    if (this.match('ENUM')) {
      return this.parseEnumType();
    } else if (this.match('INT') && this.peek(1)?.value === '[') {
      return this.parseIntRangeType();
    } else if (this.match('LIST')) {
      return this.parseListType();
    } else {
      const type = this.consume('IDENTIFIER').value.toLowerCase();
      return {
        type,
        properties: {}
      };
    }
  }

  private parseEnumType(): any {
    this.consume('ENUM');
    this.consume('(');
    
    const values = [];
    while (!this.match(')')) {
      const value = this.consume('IDENTIFIER').value;
      values.push(value);
      if (this.match(',')) this.consume(',');
    }
    
    this.consume(')');
    
    return {
      type: 'enum',
      properties: { values, default: values[0] }
    };
  }

  private parseIntRangeType(): any {
    this.consume('INT');
    this.consume('[');
    
    const min = parseInt(this.consume('NUMBER').value);
    this.consume(',');
    const max = parseInt(this.consume('NUMBER').value);
    this.consume(']');
    
    return {
      type: 'int_range',
      properties: { min, max, default: min }
    };
  }

  private parseListType(): any {
    this.consume('LIST');
    this.consume('<');
    const elementType = this.consume('IDENTIFIER').value;
    this.consume('>');
    
    return {
      type: 'list',
      properties: { elementType, default: [] }
    };
  }

  private parseEventDefinition(): any {
    const event: any = {
      type: 'Event',
      name: '',
      clauses: {}
    };

    this.consume('EVENT');
    event.name = this.consume('IDENTIFIER').value;
    this.consume('{');
    
    while (!this.match('}')) {
      const clause = this.parseEventClause();
      if (clause) {
        event.clauses[clause.type] = clause.value;
      }
    }
    
    this.consume('}');
    return event;
  }

  private parseEventClause(): any {
    if (this.match('REQUIRES')) {
      this.consume('REQUIRES');
      this.consume(':');
      return {
        type: 'requires',
        value: this.parseExpression()
      };
    } else if (this.match('TARGET')) {
      this.consume('TARGET');
      this.consume(':');
      return {
        type: 'target',
        value: this.consume('IDENTIFIER').value
      };
    } else if (this.match('EFFECT')) {
      this.consume('EFFECT');
      this.consume(':');
      return {
        type: 'effect',
        value: this.parseExpression()
      };
    } else if (this.match('P') && this.peek(1)?.value === '[') {
      return this.parseProbabilityClause();
    }
    
    // Skip unknown
    this.consume();
    return null;
  }

  private parseProbabilityClause(): any {
    this.consume('P');
    this.consume('[');
    
    const effect = this.parseExpression();
    this.consume(']');
    this.consume('=');
    const probability = parseFloat(this.consume('NUMBER').value);
    
    return {
      type: 'probability',
      value: { effect, probability }
    };
  }
}