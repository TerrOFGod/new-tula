// src/api/services/specification.service.ts

import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { EntityParser } from '../../core/parser/entity-parser';
import { GraphBuilder } from '../../core/adapter/graph-builder';
import { StateManager } from '../../core/interpreter/state-manager';
import { Executor } from '../../core/interpreter/executor';

export interface SpecificationMetadata {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  entityCount: number;
  ruleCount: number;
  hasTemporal: boolean;
  hasProbability: boolean;
  status: 'parsed' | 'validated' | 'error';
  errors?: string[];
}

@Injectable()
export class SpecificationService {
  private specifications = new Map<string, any>();
  private metadata = new Map<string, SpecificationMetadata>();

  constructor(
    private readonly entityParser: EntityParser,
    private readonly graphBuilder: GraphBuilder,
    @Inject(forwardRef(() => StateManager))
    private readonly stateManager: StateManager,
    private readonly executor: Executor
  ) {}

  async parseSpecification(
    source: string,
    metadata: {
      name?: string;
      description?: string;
      userId?: string;
    } = {}
  ): Promise<{
    specification: any;
    metadata: SpecificationMetadata;
    graph: any;
  }> {
    try {
      // Parse the specification
      const ast = this.entityParser.parseEntity(source);
      
      // Generate ID
      const specId = this.generateId('spec');
      
      // Create specification object
      const specification = {
        id: specId,
        ...ast,
        source,
        originalText: source
      };
      
      // Extract metadata
      const specMetadata: SpecificationMetadata = {
        id: specId,
        name: metadata.name || `Specification_${specId.slice(0, 8)}`,
        description: metadata.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        entityCount: ast.entities?.length || 0,
        ruleCount: ast.rules?.length || 0,
        hasTemporal: this.hasTemporalElements(ast),
        hasProbability: this.hasProbabilityElements(ast),
        status: 'parsed',
        errors: []
      };
      
      // Build initial graph
      const graph = this.graphBuilder.buildGraph(specification);
      
      // Initialize state
      this.stateManager.createState(specId, ast.entities || []);
      
      // Store specification
      this.specifications.set(specId, specification);
      this.metadata.set(specId, specMetadata);
      
      return {
        specification,
        metadata: specMetadata,
        graph
      };
      
    } catch (error) {
      throw new Error(`Failed to parse specification: ${error.message}`);
    }
  }

  async validateSpecification(source: string): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
  }> {
    const result = {
      valid: true,
      errors: [] as string[],
      warnings: [] as string[],
      suggestions: [] as string[]
    };
    
    try {
      // Basic syntax validation
      if (!source.trim()) {
        result.errors.push('Empty specification');
        result.valid = false;
        return result;
      }
      
      // Check for required sections
      if (!source.includes('Entity')) {
        result.errors.push('No Entity definitions found');
        result.valid = false;
      }
      
      if (!source.includes('State')) {
        result.warnings.push('No State definitions found');
      }
      
      if (!source.includes('Event')) {
        result.warnings.push('No Event definitions found');
      }
      
      // Check for balanced braces
      const openBraces = (source.match(/{/g) || []).length;
      const closeBraces = (source.match(/}/g) || []).length;
      if (openBraces !== closeBraces) {
        result.errors.push(`Unbalanced braces: ${openBraces} opening vs ${closeBraces} closing`);
        result.valid = false;
      }
      
      // Check for common syntax errors
      const lines = source.split('\n');
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        
        // Check for Entity without opening brace
        if (trimmed.startsWith('Entity') && !trimmed.includes('{')) {
          result.errors.push(`Line ${index + 1}: Entity definition missing opening brace`);
          result.valid = false;
        }
        
        // Check for unclosed comments
        if (trimmed.includes('/*') && !trimmed.includes('*/')) {
          result.errors.push(`Line ${index + 1}: Unclosed multi-line comment`);
          result.valid = false;
        }
      });
      
      // If no errors, try to parse
      if (result.valid) {
        try {
          const ast = this.entityParser.parseEntity(source);
          
          // Validate AST structure
          if (!ast.entities || ast.entities.length === 0) {
            result.errors.push('No valid entities found');
            result.valid = false;
          }
          
          // Check for duplicate entity names
          const entityNames = new Set<string>();
          ast.entities?.forEach((entity: any) => {
            if (entityNames.has(entity.name)) {
              result.errors.push(`Duplicate entity name: ${entity.name}`);
              result.valid = false;
            }
            entityNames.add(entity.name);
          });
          
          // Check for undefined references
          const definedEntities = new Set(ast.entities?.map((e: any) => e.name) || []);
          
          ast.entities?.forEach((entity: any) => {
            entity.events?.forEach((event: any) => {
              if (event.targetType && !definedEntities.has(event.targetType)) {
                result.warnings.push(`Event ${event.name} targets undefined entity: ${event.targetType}`);
              }
            });
          });
          
          // Provide suggestions
          if (ast.rules?.length === 0) {
            result.suggestions.push('Consider adding rules for game flow control');
          }
          
          if (!this.hasTemporalElements(ast)) {
            result.suggestions.push('Consider adding temporal operators for time-based logic');
          }
          
          if (!this.hasProbabilityElements(ast)) {
            result.suggestions.push('Consider adding probability elements for random events');
          }
          
        } catch (parseError) {
          result.errors.push(`Parse error: ${parseError.message}`);
          result.valid = false;
        }
      }
      
      return result;
      
    } catch (error) {
      result.errors.push(`Validation error: ${error.message}`);
      result.valid = false;
      return result;
    }
  }

  async getSpecification(id: string): Promise<{
    specification: any;
    metadata: SpecificationMetadata;
    graph?: any;
    state?: any;
  }> {
    const specification = this.specifications.get(id);
    const metadata = this.metadata.get(id);
    
    if (!specification || !metadata) {
      throw new Error(`Specification ${id} not found`);
    }
    
    const result: any = {
      specification,
      metadata
    };
    
    // Build graph if requested
    const graph = this.graphBuilder.buildGraph(specification);
    result.graph = graph;
    
    // Get current state if available
    const state = this.stateManager.getState(id);
    if (state) {
      result.state = state;
      result.graph = this.graphBuilder.updateGraphWithState(graph, state);
    }
    
    return result;
  }

  async listSpecifications(filter?: {
    userId?: string;
    status?: string[];
    hasTemporal?: boolean;
    hasProbability?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{
    items: SpecificationMetadata[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const allMetadata = Array.from(this.metadata.values());
    
    // Apply filters
    let filtered = allMetadata;
    
    if (filter?.status?.length) {
      filtered = filtered.filter(m => filter.status!.includes(m.status));
    }
    
    if (filter?.hasTemporal !== undefined) {
      filtered = filtered.filter(m => m.hasTemporal === filter.hasTemporal);
    }
    
    if (filter?.hasProbability !== undefined) {
      filtered = filtered.filter(m => m.hasProbability === filter.hasProbability);
    }
    
    // Apply pagination
    const limit = filter?.limit || 50;
    const offset = filter?.offset || 0;
    const paginated = filtered.slice(offset, offset + limit);
    
    return {
      items: paginated,
      total: filtered.length,
      limit,
      offset
    };
  }

  async updateSpecification(
    id: string,
    updates: {
      name?: string;
      description?: string;
      source?: string;
    }
  ): Promise<SpecificationMetadata> {
    const specification = this.specifications.get(id);
    const metadata = this.metadata.get(id);
    
    if (!specification || !metadata) {
      throw new Error(`Specification ${id} not found`);
    }
    
    // Update source if provided
    if (updates.source) {
      try {
        const ast = this.entityParser.parseEntity(updates.source);
        specification.source = updates.source;
        specification.originalText = updates.source;
        Object.assign(specification, ast);
        
        // Update metadata
        metadata.entityCount = ast.entities?.length || 0;
        metadata.ruleCount = ast.rules?.length || 0;
        metadata.hasTemporal = this.hasTemporalElements(ast);
        metadata.hasProbability = this.hasProbabilityElements(ast);
        
        // Reset state
        this.stateManager.createState(id, ast.entities || []);
        
      } catch (error) {
        throw new Error(`Failed to update specification: ${error.message}`);
      }
    }
    
    // Update metadata
    if (updates.name) metadata.name = updates.name;
    if (updates.description) metadata.description = updates.description;
    metadata.updatedAt = new Date();
    
    this.specifications.set(id, specification);
    this.metadata.set(id, metadata);
    
    return metadata;
  }

  async deleteSpecification(id: string): Promise<boolean> {
    const existed = this.specifications.has(id);
    
    if (existed) {
      this.specifications.delete(id);
      this.metadata.delete(id);
      
      // Clean up state
      this.stateManager.resetState(id);
    }
    
    return existed;
  }

  async executeEvent(
    specificationId: string,
    eventData: {
      entityType: string;
      instanceId: string;
      eventName: string;
      parameters?: Record<string, any>;
    }
  ): Promise<any> {
    const specification = this.specifications.get(specificationId);
    if (!specification) {
      throw new Error(`Specification ${specificationId} not found`);
    }
    
    // Find the entity and event
    const entity = specification.entities?.find((e: any) => e.name === eventData.entityType);
    if (!entity) {
      throw new Error(`Entity ${eventData.entityType} not found`);
    }
    
    const event = entity.events?.find((e: any) => e.name === eventData.eventName);
    if (!event) {
      throw new Error(`Event ${eventData.eventName} not found in entity ${eventData.entityType}`);
    }
    
    // Execute the event
    const context = {
      specificationId,
      entityType: eventData.entityType,
      instanceId: eventData.instanceId,
      event: {
        ...event,
        parameters: eventData.parameters
      }
    };
    
    const result = await this.executor.executeEvent(context);
    
    // Update state timestamp
    const metadata = this.metadata.get(specificationId);
    if (metadata) {
      metadata.updatedAt = new Date();
      this.metadata.set(specificationId, metadata);
    }
    
    return result;
  }

  async executeRule(
    specificationId: string,
    ruleName: string
  ): Promise<any> {
    const specification = this.specifications.get(specificationId);
    if (!specification) {
      throw new Error(`Specification ${specificationId} not found`);
    }
    
    // Find the rule
    const rule = specification.rules?.find((r: any) => r.name === ruleName);
    if (!rule) {
      throw new Error(`Rule ${ruleName} not found`);
    }
    
    // Execute the rule
    const context = {
      specificationId,
      rule
    };
    
    const result = await this.executor.executeRule(context);
    
    // Update state timestamp
    const metadata = this.metadata.get(specificationId);
    if (metadata) {
      metadata.updatedAt = new Date();
      this.metadata.set(specificationId, metadata);
    }
    
    return result;
  }

  private hasTemporalElements(ast: any): boolean {
    // Check for temporal operators in rules
    if (ast.rules) {
      for (const rule of ast.rules) {
        if (rule.temporalOperators?.length > 0) {
          return true;
        }
        if (rule.when?.includes('G(') || rule.when?.includes('F(') || 
            rule.when?.includes('X(') || rule.when?.includes('U')) {
          return true;
        }
        if (rule.effect?.includes('G(') || rule.effect?.includes('F(') || 
            rule.effect?.includes('X(') || rule.effect?.includes('U')) {
          return true;
        }
      }
    }
    
    // Check for temporal operators in events
    if (ast.entities) {
      for (const entity of ast.entities) {
        if (entity.events) {
          for (const event of entity.events) {
            if (event.requires?.includes('G(') || event.requires?.includes('F(') || 
                event.requires?.includes('X(') || event.requires?.includes('U')) {
              return true;
            }
            if (event.effect?.includes('G(') || event.effect?.includes('F(') || 
                event.effect?.includes('X(') || event.effect?.includes('U')) {
              return true;
            }
          }
        }
      }
    }
    
    return false;
  }

  private hasProbabilityElements(ast: any): boolean {
    // Check for probability expressions in rules
    if (ast.rules) {
      for (const rule of ast.rules) {
        if (rule.probabilityConstraints?.length > 0) {
          return true;
        }
        if (rule.when?.includes('P[') || rule.effect?.includes('P[')) {
          return true;
        }
      }
    }
    
    // Check for probability expressions in events
    if (ast.entities) {
      for (const entity of ast.entities) {
        if (entity.events) {
          for (const event of entity.events) {
            if (event.probabilityEffects?.length > 0) {
              return true;
            }
            if (event.requires?.includes('P[') || event.effect?.includes('P[')) {
              return true;
            }
          }
        }
      }
    }
    
    return false;
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}