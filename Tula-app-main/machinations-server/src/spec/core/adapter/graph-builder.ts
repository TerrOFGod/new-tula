// src/core/adapter/graph-builder.ts

import { Injectable } from '@nestjs/common';

export interface GraphNode {
  id: string;
  type: string;
  data: {
    label: string;
    struct: string;
    name: string;
    properties?: Record<string, any>;
    state?: Record<string, any>;
    metadata?: Record<string, any>;
  };
  position: { x: number; y: number };
  style?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: any;
  label?: string;
  animated?: boolean;
  style?: Record<string, any>;
}

export interface GraphStructure {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: {
    entityCount: number;
    eventCount: number;
    ruleCount: number;
    generatedAt: Date;
    specificationId?: string;
  };
}

export interface NodeLayout {
  gridSize: number;
  nodeSpacing: number;
  layerSpacing: number;
  startPosition: { x: number; y: number };
}

@Injectable()
export class GraphBuilder {
  private nodeCounter = 0;
  private edgeCounter = 0;

  buildGraph(
    specification: any,
    currentState?: any,
    layout?: NodeLayout
  ): GraphStructure {
    const defaultLayout: NodeLayout = {
      gridSize: 100,
      nodeSpacing: 150,
      layerSpacing: 200,
      startPosition: { x: 50, y: 50 }
    };

    const finalLayout = { ...defaultLayout, ...layout };
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // Build entity nodes
    const entityNodes = this.buildEntityNodes(specification, currentState, finalLayout);
    nodes.push(...entityNodes);

    // Build event nodes and connect to entities
    const eventResults = this.buildEventNodes(specification, entityNodes, finalLayout);
    nodes.push(...eventResults.nodes);
    edges.push(...eventResults.edges);

    // Build rule nodes
    const ruleResults = this.buildRuleNodes(specification, entityNodes, finalLayout);
    nodes.push(...ruleResults.nodes);
    edges.push(...ruleResults.edges);

    return {
      nodes,
      edges,
      metadata: {
        entityCount: specification.entities?.length || 0,
        eventCount: this.countEvents(specification),
        ruleCount: specification.rules?.length || 0,
        generatedAt: new Date(),
        specificationId: specification.id
      }
    };
  }

  private buildEntityNodes(
    specification: any,
    currentState: any,
    layout: NodeLayout
  ): GraphNode[] {
    const nodes: GraphNode[] = [];
    const { startPosition, nodeSpacing } = layout;

    if (!specification.entities) return nodes;

    specification.entities.forEach((entity: any, index: number) => {
      const nodeId = this.generateNodeId('entity');
      const nodeType = this.determineNodeType(entity);
      
      // Get current state for this entity
      const entityState = currentState?.entities?.[entity.name]?.[0]?.state || {};
      
      nodes.push({
        id: nodeId,
        type: nodeType,
        data: {
          label: entity.name,
          struct: nodeType,
          name: entity.name,
          properties: this.extractEntityProperties(entity),
          state: entityState,
          metadata: {
            type: 'entity',
            original: entity
          }
        },
        position: {
          x: startPosition.x + (index * nodeSpacing),
          y: startPosition.y
        },
        style: this.getNodeStyle(nodeType)
      });
    });

    return nodes;
  }

  private buildEventNodes(
    specification: any,
    entityNodes: GraphNode[],
    layout: NodeLayout
  ): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const { startPosition, nodeSpacing, layerSpacing } = layout;

    if (!specification.entities) return { nodes, edges };

    let eventIndex = 0;
    
    specification.entities.forEach((entity: any, entityIndex: number) => {
      const entityNode = entityNodes.find(n => n.data.name === entity.name);
      if (!entityNode || !entity.events) return;

      entity.events.forEach((event: any, eventIdx: number) => {
        const eventNodeId = this.generateNodeId('event');
        const eventType = this.determineEventType(event);
        
        nodes.push({
          id: eventNodeId,
          type: eventType,
          data: {
            label: event.name,
            struct: eventType,
            name: `${entity.name}.${event.name}`,
            properties: this.extractEventProperties(event),
            metadata: {
              type: 'event',
              entity: entity.name,
              original: event
            }
          },
          position: {
            x: startPosition.x + (entityIndex * nodeSpacing),
            y: startPosition.y + layerSpacing + (eventIdx * nodeSpacing * 0.8)
          },
          style: this.getNodeStyle(eventType)
        });

        // Connect entity to event
        edges.push({
          id: this.generateEdgeId(),
          source: entityNode.id,
          target: eventNodeId,
          type: 'smoothstep',
          label: 'has',
          style: { stroke: '#666' }
        });

        // Connect event to targets
        if (event.targetType) {
          const targetEntityNode = entityNodes.find(n => n.data.name === event.targetType);
          if (targetEntityNode) {
            edges.push({
              id: this.generateEdgeId(),
              source: eventNodeId,
              target: targetEntityNode.id,
              type: 'smoothstep',
              label: 'affects',
              animated: false,
              style: { stroke: '#ff6b6b', strokeWidth: 2 }
            });
          }
        }

        eventIndex++;
      });
    });

    return { nodes, edges };
  }

  private buildRuleNodes(
    specification: any,
    entityNodes: GraphNode[],
    layout: NodeLayout
  ): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const { startPosition, nodeSpacing, layerSpacing } = layout;

    if (!specification.rules) return { nodes, edges };

    specification.rules.forEach((rule: any, index: number) => {
      const ruleNodeId = this.generateNodeId('rule');
      const ruleType = this.determineRuleType(rule);
      
      nodes.push({
        id: ruleNodeId,
        type: ruleType,
        data: {
          label: rule.name,
          struct: ruleType,
          name: rule.name,
          properties: this.extractRuleProperties(rule),
          metadata: {
            type: 'rule',
            original: rule
          }
        },
        position: {
          x: startPosition.x + (index * nodeSpacing),
          y: startPosition.y + (layerSpacing * 2)
        },
        style: this.getNodeStyle(ruleType)
      });

      // Connect rule to affected entities
      const affectedEntities = this.extractAffectedEntities(rule);
      affectedEntities.forEach(entityName => {
        const entityNode = entityNodes.find(n => n.data.name === entityName);
        if (entityNode) {
          edges.push({
            id: this.generateEdgeId(),
            source: ruleNodeId,
            target: entityNode.id,
            type: 'straight',
            label: 'constrains',
            style: { stroke: '#4ecdc4', strokeDasharray: '5,5' }
          });
        }
      });
    });

    return { nodes, edges };
  }

  private determineNodeType(entity: any): string {
    // Analyze entity properties to determine node type
    const properties = this.extractEntityProperties(entity);
    
    if (properties.Health !== undefined && properties.Attack !== undefined) {
      return 'Pool';
    } else if (properties.Mana !== undefined) {
      return 'Converter';
    } else if (properties.Amount !== undefined) {
      return 'Source';
    } else if (entity.events?.some((e: any) => e.probabilityEffects?.length > 0)) {
      return 'Random';
    } else if (entity.events?.some((e: any) => e.requires?.includes('delay'))) {
      return 'Delay';
    }
    
    return 'Pool'; // Default
  }

  private determineEventType(event: any): string {
    if (event.probabilityEffects?.length > 0) {
      return 'Random';
    } else if (event.requires?.includes('delay')) {
      return 'Delay';
    } else if (event.targetType) {
      return 'Converter';
    }
    
    return 'Converter'; // Default
  }

  private determineRuleType(rule: any): string {
    if (rule.temporalOperators?.length > 0) {
      return 'Gate';
    } else if (rule.probabilityConstraints?.length > 0) {
      return 'Random';
    }
    
    return 'Gate'; // Default
  }

  private extractEntityProperties(entity: any): Record<string, any> {
    const properties: Record<string, any> = {};
    
    if (entity.states) {
      entity.states.forEach((state: any) => {
        properties[state.name] = {
          type: state.type,
          ...state.properties
        };
      });
    }
    
    return properties;
  }

  private extractEventProperties(event: any): Record<string, any> {
    const properties: Record<string, any> = {
      targetType: event.targetType,
      requires: event.requires,
      effect: event.effect
    };
    
    if (event.probabilityEffects) {
      properties.probabilityEffects = event.probabilityEffects;
    }
    
    return properties;
  }

  private extractRuleProperties(rule: any): Record<string, any> {
    const properties: Record<string, any> = {
      when: rule.when,
      effect: rule.effect
    };
    
    if (rule.temporalOperators) {
      properties.temporalOperators = rule.temporalOperators;
    }
    
    if (rule.probabilityConstraints) {
      properties.probabilityConstraints = rule.probabilityConstraints;
    }
    
    return properties;
  }

  private extractAffectedEntities(rule: any): string[] {
    const entities = new Set<string>();
    
    const extractFromExpression = (expr: string) => {
      if (!expr) return;
      
      // Find Entity.Property patterns
      const matches = expr.match(/(\w+)\.\w+/g) || [];
      matches.forEach(match => {
        const entity = match.split('.')[0];
        if (entity !== 'Self' && entity !== 'Target') {
          entities.add(entity);
        }
      });
    };
    
    if (rule.when) {
      extractFromExpression(rule.when);
    }
    
    if (rule.effect) {
      extractFromExpression(rule.effect);
    }
    
    rule.temporalOperators?.forEach((op: any) => {
      extractFromExpression(op.expression);
    });
    
    rule.probabilityConstraints?.forEach((constraint: any) => {
      extractFromExpression(constraint.expression);
    });
    
    return Array.from(entities);
  }

  private getNodeStyle(nodeType: string): Record<string, any> {
    const styles: Record<string, any> = {
      Pool: {
        backgroundColor: '#e3f2fd',
        borderColor: '#2196f3',
        color: '#0d47a1'
      },
      Source: {
        backgroundColor: '#e8f5e9',
        borderColor: '#4caf50',
        color: '#1b5e20'
      },
      Converter: {
        backgroundColor: '#fff3e0',
        borderColor: '#ff9800',
        color: '#e65100'
      },
      Random: {
        backgroundColor: '#fce4ec',
        borderColor: '#e91e63',
        color: '#880e4f'
      },
      Gate: {
        backgroundColor: '#f3e5f5',
        borderColor: '#9c27b0',
        color: '#4a148c'
      },
      Delay: {
        backgroundColor: '#e0f2f1',
        borderColor: '#009688',
        color: '#004d40'
      }
    };
    
    return styles[nodeType] || styles.Pool;
  }

  private countEvents(specification: any): number {
    if (!specification.entities) return 0;
    
    return specification.entities.reduce((total: number, entity: any) => {
      return total + (entity.events?.length || 0);
    }, 0);
  }

  private generateNodeId(prefix: string): string {
    return `${prefix}_${this.nodeCounter++}`;
  }

  private generateEdgeId(): string {
    return `edge_${this.edgeCounter++}`;
  }

  updateGraphWithState(
    graph: GraphStructure,
    currentState: any
  ): GraphStructure {
    const updatedNodes = graph.nodes.map(node => {
      if (node.data.metadata?.type === 'entity') {
        const entityName = node.data.name;
        const entityState = currentState?.entities?.[entityName]?.[0]?.state || {};
        
        return {
          ...node,
          data: {
            ...node.data,
            state: entityState,
            label: `${entityName} (${JSON.stringify(entityState)})`
          }
        };
      }
      return node;
    });

    return {
      ...graph,
      nodes: updatedNodes,
      metadata: {
        ...graph.metadata,
        updatedAt: new Date()
      }
    };
  }

  exportToReactFlow(graph: GraphStructure): any {
    return {
      nodes: graph.nodes.map(node => ({
        id: node.id,
        type: node.type.toLowerCase() + 'Node',
        position: node.position,
        data: node.data,
        style: node.style
      })),
      edges: graph.edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        data: edge.data,
        label: edge.label,
        animated: edge.animated,
        style: edge.style
      }))
    };
  }
}