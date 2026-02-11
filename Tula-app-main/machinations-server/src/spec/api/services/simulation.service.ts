// src/api/services/simulation.service.ts

import { Injectable } from '@nestjs/common';
import { StateManager } from '../../core/interpreter/state-manager';
import { Executor } from '../../core/interpreter/executor';
import { SpecificationService } from './specification.service';

export interface Simulation {
  id: string;
  specificationId: string;
  name: string;
  description?: string;
  status: 'created' | 'running' | 'paused' | 'completed' | 'error';
  currentStep: number;
  maxSteps: number;
  stepInterval: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  results?: any;
  statistics?: Record<string, any>;
}

export interface SimulationResult {
  simulation: Simulation;
  finalState: any;
  history: any[];
  metrics: {
    totalSteps: number;
    duration: number;
    eventsExecuted: number;
    rulesExecuted: number;
    successRate: number;
  };
}

@Injectable()
export class SimulationService {
  private simulations = new Map<string, Simulation>();
  private activeSimulations = new Set<string>();
  private simulationResults = new Map<string, SimulationResult>();

  constructor(
    private readonly stateManager: StateManager,
    private readonly executor: Executor,
    private readonly specService: SpecificationService
  ) {}

  async createSimulation(
    specificationId: string,
    options: {
      name?: string;
      description?: string;
      maxSteps?: number;
      stepInterval?: number;
      initialState?: Record<string, any>;
    } = {}
  ): Promise<Simulation> {
    // Get specification
    const specResult = await this.specService.getSpecification(specificationId);
    
    // Create simulation
    const simulation: Simulation = {
      id: this.generateId('sim'),
      specificationId,
      name: options.name || `Simulation_${Date.now()}`,
      description: options.description,
      status: 'created',
      currentStep: 0,
      maxSteps: options.maxSteps || 100,
      stepInterval: options.stepInterval || 1,
      createdAt: new Date(),
      statistics: {
        eventsExecuted: 0,
        rulesExecuted: 0,
        stateChanges: 0
      }
    };
    
    // Initialize simulation state
    this.stateManager.createState(simulation.id, specResult.specification.entities || []);
    
    // Apply initial state if provided
    if (options.initialState) {
      this.applyInitialState(simulation.id, options.initialState);
    }
    
    this.simulations.set(simulation.id, simulation);
    return simulation;
  }

  async startSimulation(simulationId: string): Promise<Simulation> {
    const simulation = this.simulations.get(simulationId);
    if (!simulation) {
      throw new Error(`Simulation ${simulationId} not found`);
    }
    
    if (simulation.status === 'running') {
      throw new Error('Simulation is already running');
    }
    
    simulation.status = 'running';
    simulation.startedAt = new Date();
    this.activeSimulations.add(simulationId);
    this.simulations.set(simulationId, simulation);
    
    // Start simulation in background
    this.runSimulation(simulationId).catch(error => {
      console.error(`Simulation ${simulationId} failed:`, error);
      simulation.status = 'error';
      this.simulations.set(simulationId, simulation);
      this.activeSimulations.delete(simulationId);
    });
    
    return simulation;
  }

  async pauseSimulation(simulationId: string): Promise<Simulation> {
    const simulation = this.simulations.get(simulationId);
    if (!simulation) {
      throw new Error(`Simulation ${simulationId} not found`);
    }
    
    if (simulation.status !== 'running') {
      throw new Error('Simulation is not running');
    }
    
    simulation.status = 'paused';
    this.activeSimulations.delete(simulationId);
    this.simulations.set(simulationId, simulation);
    
    return simulation;
  }

  async resumeSimulation(simulationId: string): Promise<Simulation> {
    const simulation = this.simulations.get(simulationId);
    if (!simulation) {
      throw new Error(`Simulation ${simulationId} not found`);
    }
    
    if (simulation.status !== 'paused') {
      throw new Error('Simulation is not paused');
    }
    
    simulation.status = 'running';
    this.activeSimulations.add(simulationId);
    this.simulations.set(simulationId, simulation);
    
    // Continue simulation
    this.runSimulation(simulationId).catch(error => {
      console.error(`Simulation ${simulationId} failed:`, error);
      simulation.status = 'error';
      this.simulations.set(simulationId, simulation);
      this.activeSimulations.delete(simulationId);
    });
    
    return simulation;
  }

  async stopSimulation(simulationId: string): Promise<Simulation> {
    const simulation = this.simulations.get(simulationId);
    if (!simulation) {
      throw new Error(`Simulation ${simulationId} not found`);
    }
    
    simulation.status = 'completed';
    simulation.completedAt = new Date();
    this.activeSimulations.delete(simulationId);
    this.simulations.set(simulationId, simulation);
    
    return simulation;
  }

  async getSimulation(simulationId: string): Promise<{
    simulation: Simulation;
    currentState?: any;
    result?: SimulationResult;
  }> {
    const simulation = this.simulations.get(simulationId);
    if (!simulation) {
      throw new Error(`Simulation ${simulationId} not found`);
    }
    
    const result: any = {
      simulation
    };
    
    // Get current state
    const state = this.stateManager.getState(simulationId);
    if (state) {
      result.currentState = state;
    }
    
    // Get results if completed
    const simulationResult = this.simulationResults.get(simulationId);
    if (simulationResult) {
      result.result = simulationResult;
    }
    
    return result;
  }

  async getSimulationHistory(simulationId: string): Promise<any[]> {
    const state = this.stateManager.getState(simulationId);
    if (!state) {
      throw new Error(`Simulation state ${simulationId} not found`);
    }
    
    return state.history || [];
  }

  private async runSimulation(simulationId: string): Promise<void> {
    const simulation = this.simulations.get(simulationId);
    if (!simulation) return;

    const specResult = await this.specService.getSpecification(simulation.specificationId);
    const specification = specResult.specification;

    const history: any[] = [];
    const eventsExecuted: string[] = [];
    const rulesExecuted: string[] = [];

    try {
      while (
        simulation.status === 'running' &&
        simulation.currentStep < simulation.maxSteps
      ) {
        const stepResult = await this.executeSimulationStep(
          simulationId,
          specification,
          simulation.currentStep
        );

        // Record step results
        eventsExecuted.push(...stepResult.events);
        rulesExecuted.push(...stepResult.rules);

        // Update simulation state
        simulation.currentStep++;
        
        if (simulation.statistics) {
          simulation.statistics.eventsExecuted += stepResult.events.length;
          simulation.statistics.rulesExecuted += stepResult.rules.length;
          simulation.statistics.stateChanges += stepResult.changes.length;
        }

        // Check termination conditions
        const state = this.stateManager.getState(simulationId);
        if (state?.variables.get('GameOver') === true ||
            state?.variables.get('LevelComplete') === true) {
          break;
        }

        // Record history
        if (state) {
          history.push({
            step: simulation.currentStep,
            time: state.time,
            state: this.createStateSnapshot(state),
            events: stepResult.events,
            rules: stepResult.rules
          });
        }

        // Wait for next step
        if (simulation.stepInterval > 0) {
          await this.sleep(simulation.stepInterval * 1000);
        }

        // Save simulation progress
        this.simulations.set(simulationId, simulation);
      }

      // Simulation completed
      simulation.status = 'completed';
      simulation.completedAt = new Date();
      this.activeSimulations.delete(simulationId);
      this.simulations.set(simulationId, simulation);

      // Create simulation result
      const finalState = this.stateManager.getState(simulationId);
      const duration = simulation.completedAt.getTime() - simulation.startedAt!.getTime();

      const result: SimulationResult = {
        simulation,
        finalState,
        history,
        metrics: {
          totalSteps: simulation.currentStep,
          duration,
          eventsExecuted: eventsExecuted.length,
          rulesExecuted: rulesExecuted.length,
          successRate: 1.0 // Simplified
        }
      };

      this.simulationResults.set(simulationId, result);

    } catch (error) {
      simulation.status = 'error';
      this.activeSimulations.delete(simulationId);
      this.simulations.set(simulationId, simulation);
      
      throw error;
    }
  }

  private async executeSimulationStep(
    simulationId: string,
    specification: any,
    step: number
  ): Promise<{
    events: string[];
    rules: string[];
    changes: any[];
  }> {
    const events: string[] = [];
    const rules: string[] = [];
    const changes: any[] = [];

    // Update time
    this.stateManager.updateState(simulationId, state => {
      state.time++;
      return state;
    });

    // Execute events from all entities
    if (specification.entities) {
      for (const entity of specification.entities) {
        const state = this.stateManager.getState(simulationId);
        const instances = state?.entities.get(entity.name) || [];

        for (const instance of instances) {
          if (entity.events) {
            for (const event of entity.events) {
              try {
                const context = {
                  specificationId: simulationId,
                  entityType: entity.name,
                  instanceId: instance.id,
                  event
                };

                const result = await this.executor.executeEvent(context);
                
                if (result.success) {
                  events.push(`${entity.name}.${event.name}`);
                  changes.push(...result.changes);
                }
              } catch (error) {
                console.error(`Error executing event ${entity.name}.${event.name}:`, error);
              }
            }
          }
        }
      }
    }

    // Execute rules
    if (specification.rules) {
      for (const rule of specification.rules) {
        try {
          const context = {
            specificationId: simulationId,
            rule
          };

          const result = await this.executor.executeRule(context);
          
          if (result.success) {
            rules.push(rule.name);
            changes.push(...result.changes);
          }
        } catch (error) {
          console.error(`Error executing rule ${rule.name}:`, error);
        }
      }
    }

    return { events, rules, changes };
  }

  private applyInitialState(simulationId: string, initialState: Record<string, any>): void {
    if (!initialState) return;

    this.stateManager.updateState(simulationId, state => {
      // Set global variables
      if (initialState.variables) {
        Object.entries(initialState.variables).forEach(([key, value]) => {
          state.variables.set(key, value);
        });
      }

      // Set entity states
      if (initialState.entities) {
        Object.entries(initialState.entities).forEach(([entityType, entityState]) => {
          const instances = state.entities.get(entityType);
          if (instances && instances.length > 0) {
            Object.entries(entityState as Record<string, any>).forEach(([key, value]) => {
              instances[0].state[key] = value;
            });
          }
        });
      }

      return state;
    });
  }

  private createStateSnapshot(state: any): any {
    const snapshot: any = {
      time: state.time,
      variables: Object.fromEntries(state.variables.entries()),
      entities: {}
    };

    for (const [entityType, instances] of state.entities.entries()) {
      snapshot.entities[entityType] = instances.map(inst => ({
        id: inst.id,
        state: { ...inst.state }
      }));
    }

    return snapshot;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}