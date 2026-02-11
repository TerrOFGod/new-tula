// src/core/interpreter/state-manager.ts

import { Injectable } from '@nestjs/common';

export interface EntityInstance {
  id: string;
  type: string;
  properties: Record<string, any>;
  state: Record<string, any>;
  events: string[];
  rules: string[];
}

export interface GameState {
  time: number;
  step: number;
  entities: Map<string, EntityInstance[]>;
  variables: Map<string, any>;
  history: Array<{
    time: number;
    state: Record<string, any>;
    events: string[];
  }>;
  metadata: {
    startedAt: Date;
    lastUpdated: Date;
    totalSteps: number;
  };
}

@Injectable()
export class StateManager {
  private states: Map<string, GameState> = new Map();
  private entityRegistry: Map<string, any> = new Map();

  createState(specificationId: string, entityDefinitions: any[]): GameState {
    const state: GameState = {
      time: 0,
      step: 0,
      entities: new Map(),
      variables: new Map(),
      history: [],
      metadata: {
        startedAt: new Date(),
        lastUpdated: new Date(),
        totalSteps: 0
      }
    };

    // Initialize entities from definitions
    for (const entityDef of entityDefinitions) {
      const instances: EntityInstance[] = [];
      
      // Create default instance
      const instance: EntityInstance = {
        id: `${entityDef.name}_0`,
        type: entityDef.name,
        properties: {},
        state: {},
        events: [],
        rules: []
      };

      // Initialize properties
      for (const prop of entityDef.states || []) {
        instance.state[prop.name] = prop.default || this.getDefaultValue(prop.type);
        instance.properties[prop.name] = prop;
      }

      // Register events
      instance.events = (entityDef.events || []).map((e: any) => e.name);

      instances.push(instance);
      state.entities.set(entityDef.name, instances);
      
      // Store in registry
      this.entityRegistry.set(entityDef.name, entityDef);
    }

    // Initialize global variables
    state.variables.set('time', 0);
    state.variables.set('step', 0);
    state.variables.set('GameOver', false);
    state.variables.set('LevelComplete', false);

    this.states.set(specificationId, state);
    return state;
  }

  getState(specificationId: string): GameState | undefined {
    return this.states.get(specificationId);
  }

  updateState(specificationId: string, updater: (state: GameState) => GameState): void {
    const state = this.getState(specificationId);
    if (state) {
      const newState = updater(state);
      newState.metadata.lastUpdated = new Date();
      this.states.set(specificationId, newState);
    }
  }

  updateEntity(
    specificationId: string,
    entityType: string,
    instanceId: string,
    updater: (instance: EntityInstance) => EntityInstance
  ): boolean {
    const state = this.getState(specificationId);
    if (!state) return false;

    const instances = state.entities.get(entityType);
    if (!instances) return false;

    const instanceIndex = instances.findIndex(inst => inst.id === instanceId);
    if (instanceIndex === -1) return false;

    instances[instanceIndex] = updater(instances[instanceIndex]);
    state.metadata.lastUpdated = new Date();
    return true;
  }

  updateVariable(specificationId: string, key: string, value: any): void {
    const state = this.getState(specificationId);
    if (state) {
      state.variables.set(key, value);
      state.metadata.lastUpdated = new Date();
    }
  }

  recordHistory(specificationId: string, events: string[] = []): void {
    const state = this.getState(specificationId);
    if (!state) return;

    // Create snapshot of current state
    const snapshot: any = {
      time: state.time,
      entities: {},
      variables: Object.fromEntries(state.variables.entries())
    };

    // Record entity states
    for (const [entityType, instances] of state.entities.entries()) {
      snapshot.entities[entityType] = instances.map(inst => ({
        id: inst.id,
        state: { ...inst.state }
      }));
    }

    state.history.push({
      time: state.time,
      state: snapshot,
      events
    });

    // Limit history size
    if (state.history.length > 1000) {
      state.history.shift();
    }
  }

  getEntityDefinition(entityType: string): any {
    return this.entityRegistry.get(entityType);
  }

  createEntityInstance(specificationId: string, entityType: string, customState?: any): string {
    const state = this.getState(specificationId);
    const entityDef = this.getEntityDefinition(entityType);
    
    if (!state || !entityDef) {
      throw new Error(`Entity type ${entityType} not found`);
    }

    const instanceId = `${entityType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const instance: EntityInstance = {
      id: instanceId,
      type: entityType,
      properties: {},
      state: {},
      events: [],
      rules: []
    };

    // Initialize state from definition
    for (const prop of entityDef.states || []) {
      instance.state[prop.name] = customState?.[prop.name] || prop.default || this.getDefaultValue(prop.type);
      instance.properties[prop.name] = prop;
    }

    // Add events
    instance.events = (entityDef.events || []).map((e: any) => e.name);

    // Add to state
    const instances = state.entities.get(entityType) || [];
    instances.push(instance);
    state.entities.set(entityType, instances);
    state.metadata.lastUpdated = new Date();

    return instanceId;
  }

  removeEntityInstance(specificationId: string, entityType: string, instanceId: string): boolean {
    const state = this.getState(specificationId);
    if (!state) return false;

    const instances = state.entities.get(entityType);
    if (!instances) return false;

    const initialLength = instances.length;
    const newInstances = instances.filter(inst => inst.id !== instanceId);
    
    if (newInstances.length === initialLength) {
      return false;
    }

    state.entities.set(entityType, newInstances);
    state.metadata.lastUpdated = new Date();
    return true;
  }

  private getDefaultValue(type: string): any {
    switch (type) {
      case 'int_range':
      case 'int': return 0;
      case 'float': return 0.0;
      case 'bool': return false;
      case 'string': return '';
      case 'enum': return null;
      case 'list': return [];
      default: return null;
    }
  }

  cloneState(specificationId: string): GameState | null {
    const original = this.getState(specificationId);
    if (!original) return null;

    // Deep clone the state
    const cloned: GameState = {
      time: original.time,
      step: original.step,
      entities: new Map(),
      variables: new Map(original.variables),
      history: [...original.history],
      metadata: {
        startedAt: new Date(original.metadata.startedAt),
        lastUpdated: new Date(original.metadata.lastUpdated),
        totalSteps: original.metadata.totalSteps
      }
    };

    // Clone entities
    for (const [entityType, instances] of original.entities.entries()) {
      const clonedInstances = instances.map(inst => ({
        ...inst,
        state: { ...inst.state }
      }));
      cloned.entities.set(entityType, clonedInstances);
    }

    return cloned;
  }

  resetState(specificationId: string): boolean {
    const state = this.getState(specificationId);
    if (!state) return false;

    // Reset all entity states
    for (const [entityType, instances] of state.entities.entries()) {
      const entityDef = this.entityRegistry.get(entityType);
      if (entityDef) {
        const newInstances: EntityInstance[] = [];
        
        // Keep only the first instance, reset its state
        if (instances.length > 0) {
          const instance = instances[0];
          for (const prop of entityDef.states || []) {
            instance.state[prop.name] = prop.default || this.getDefaultValue(prop.type);
          }
          newInstances.push(instance);
        }
        
        state.entities.set(entityType, newInstances);
      }
    }

    // Reset variables
    state.variables.clear();
    state.variables.set('time', 0);
    state.variables.set('step', 0);
    state.variables.set('GameOver', false);
    state.variables.set('LevelComplete', false);

    // Clear history
    state.history = [];
    state.time = 0;
    state.step = 0;
    state.metadata.lastUpdated = new Date();
    state.metadata.totalSteps = 0;

    return true;
  }
}