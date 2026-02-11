// src/core/interpreter/executor.ts

import { Injectable } from '@nestjs/common';
import { StateManager } from './state-manager';

export interface ExecutionContext {
  specificationId: string;
  state: any;
  entityType?: string;
  instanceId?: string;
  event?: any;
  rule?: any;
}

export interface ExecutionResult {
  success: boolean;
  changes: Array<{
    type: string;
    target: string;
    property?: string;
    oldValue: any;
    newValue: any;
  }>;
  errors: string[];
  warnings: string[];
}

@Injectable()
export class Executor {
  constructor(private readonly stateManager: StateManager) {}

  async executeEvent(context: ExecutionContext): Promise<ExecutionResult> {
    const result: ExecutionResult = {
      success: false,
      changes: [],
      errors: [],
      warnings: []
    };

    try {
      const { specificationId, entityType, instanceId, event } = context;
      
      if (!specificationId || !entityType || !instanceId || !event) {
        result.errors.push('Missing required context parameters');
        return result;
      }

      // Get current state
      const state = this.stateManager.getState(specificationId);
      if (!state) {
        result.errors.push('State not found');
        return result;
      }

      // Find the entity instance
      const instances = state.entities.get(entityType);
      if (!instances) {
        result.errors.push(`Entity type ${entityType} not found`);
        return result;
      }

      const instance = instances.find(inst => inst.id === instanceId);
      if (!instance) {
        result.errors.push(`Instance ${instanceId} not found`);
        return result;
      }

      // Check requirements
      if (event.requires) {
        const requirementsMet = this.evaluateCondition(event.requires, {
          Self: instance.state,
          state,
          variables: Object.fromEntries(state.variables.entries())
        });
        
        if (!requirementsMet) {
          result.warnings.push('Event requirements not met');
          return result;
        }
      }

      // Execute main effects
      if (event.effect) {
        await this.applyEffect(
          event.effect,
          instance,
          state,
          event.targetType,
          specificationId,
          result
        );
      }

      // Execute probability effects
      if (event.probabilityEffects) {
        for (const probEffect of event.probabilityEffects) {
          if (Math.random() < probEffect.probability) {
            await this.applyEffect(
              probEffect.effect,
              instance,
              state,
              event.targetType,
              specificationId,
              result
            );
          }
        }
      }

      result.success = true;
      
    } catch (error) {
      result.errors.push(`Execution error: ${error.message}`);
    }

    return result;
  }

  async executeRule(context: ExecutionContext): Promise<ExecutionResult> {
    const result: ExecutionResult = {
      success: false,
      changes: [],
      errors: [],
      warnings: []
    };

    try {
      const { specificationId, rule } = context;
      
      if (!specificationId || !rule) {
        result.errors.push('Missing required context parameters');
        return result;
      }

      const state = this.stateManager.getState(specificationId);
      if (!state) {
        result.errors.push('State not found');
        return result;
      }

      // Check when condition
      if (rule.when) {
        const conditionMet = this.evaluateCondition(rule.when, {
          state,
          variables: Object.fromEntries(state.variables.entries())
        });
        
        if (!conditionMet) {
          result.warnings.push('Rule condition not met');
          return result;
        }
      }

      // Execute effect
      if (rule.effect) {
        await this.applyRuleEffect(rule.effect, state, specificationId, result);
      }

      // Check temporal constraints
      if (rule.temporalConstraints) {
        for (const constraint of rule.temporalConstraints) {
          const satisfied = await this.checkTemporalConstraint(
            constraint,
            state,
            specificationId
          );
          
          if (!satisfied) {
            result.warnings.push(`Temporal constraint ${constraint.operator} not satisfied`);
          }
        }
      }

      // Check probability constraints
      if (rule.probabilityConstraints) {
        for (const constraint of rule.probabilityConstraints) {
          const probability = await this.calculateProbability(
            constraint.expression,
            state,
            specificationId
          );
          
          const satisfied = this.compareProbability(
            probability,
            constraint.operator,
            constraint.threshold
          );
          
          if (!satisfied) {
            result.warnings.push(`Probability constraint not satisfied: ${constraint.expression}`);
          }
        }
      }

      result.success = true;
      
    } catch (error) {
      result.errors.push(`Rule execution error: ${error.message}`);
    }

    return result;
  }

  private async applyEffect(
    effect: any,
    sourceInstance: any,
    state: any,
    targetType: string | undefined,
    specificationId: string,
    result: ExecutionResult
  ): Promise<void> {
    if (!effect) return;

    // Parse effect expression
    if (typeof effect === 'string') {
      await this.applyExpressionEffect(effect, sourceInstance, state, targetType, specificationId, result);
    } else if (typeof effect === 'object') {
      // Handle structured effect
      await this.applyStructuredEffect(effect, sourceInstance, state, targetType, specificationId, result);
    }
  }

  private async applyExpressionEffect(
    expression: string,
    sourceInstance: any,
    state: any,
    targetType: string | undefined,
    specificationId: string,
    result: ExecutionResult
  ): Promise<void> {
    // Parse the expression
    const parsed = this.parseExpression(expression);
    
    switch (parsed.type) {
      case 'assignment':
        await this.applyAssignment(parsed, sourceInstance, state, targetType, specificationId, result);
        break;
      case 'modification':
        await this.applyModification(parsed, sourceInstance, state, targetType, specificationId, result);
        break;
      case 'function_call':
        await this.applyFunctionCall(parsed, sourceInstance, state, targetType, specificationId, result);
        break;
      default:
        result.warnings.push(`Unsupported expression type: ${parsed.type}`);
    }
  }

  private async applyAssignment(
    parsed: any,
    sourceInstance: any,
    state: any,
    targetType: string | undefined,
    specificationId: string,
    result: ExecutionResult
  ): Promise<void> {
    const { target, property, value } = parsed;
    
    let targetInstance: any;
    if (target === 'Self') {
      targetInstance = sourceInstance;
    } else if (target === 'Target' && targetType) {
      const targetInstances = state.entities.get(targetType);
      if (targetInstances && targetInstances.length > 0) {
        targetInstance = targetInstances[0];
      }
    } else {
      // Entity name
      const targetInstances = state.entities.get(target);
      if (targetInstances && targetInstances.length > 0) {
        targetInstance = targetInstances[0];
      }
    }

    if (!targetInstance) {
      result.errors.push(`Target not found: ${target}`);
      return;
    }

    const oldValue = targetInstance.state[property];
    const newValue = await this.evaluateValue(value, {
      Self: sourceInstance.state,
      Target: targetInstance?.state,
      state,
      variables: Object.fromEntries(state.variables.entries())
    });

    // Record change
    result.changes.push({
      type: 'assignment',
      target: targetInstance.id,
      property,
      oldValue,
      newValue
    });

    // Apply change
    targetInstance.state[property] = newValue;
    
    // Update state
    this.stateManager.updateState(specificationId, s => s);
  }

  private async applyModification(
    parsed: any,
    sourceInstance: any,
    state: any,
    targetType: string | undefined,
    specificationId: string,
    result: ExecutionResult
  ): Promise<void> {
    const { target, property, operator, value } = parsed;
    
    let targetInstance: any;
    if (target === 'Self') {
      targetInstance = sourceInstance;
    } else if (target === 'Target' && targetType) {
      const targetInstances = state.entities.get(targetType);
      if (targetInstances && targetInstances.length > 0) {
        targetInstance = targetInstances[0];
      }
    } else {
      const targetInstances = state.entities.get(target);
      if (targetInstances && targetInstances.length > 0) {
        targetInstance = targetInstances[0];
      }
    }

    if (!targetInstance) {
      result.errors.push(`Target not found: ${target}`);
      return;
    }

    const oldValue = targetInstance.state[property];
    const modification = await this.evaluateValue(value, {
      Self: sourceInstance.state,
      Target: targetInstance?.state,
      state,
      variables: Object.fromEntries(state.variables.entries())
    });

    let newValue = oldValue;
    switch (operator) {
      case '+=':
        newValue = oldValue + modification;
        break;
      case '-=':
        newValue = Math.max(0, oldValue - modification);
        break;
      case '*=':
        newValue = oldValue * modification;
        break;
      case '/=':
        newValue = oldValue / modification;
        break;
    }

    // Record change
    result.changes.push({
      type: 'modification',
      target: targetInstance.id,
      property,
      oldValue,
      newValue
    });

    // Apply change
    targetInstance.state[property] = newValue;
    
    // Update state
    this.stateManager.updateState(specificationId, s => s);
  }

  private async applyRuleEffect(
    effect: string,
    state: any,
    specificationId: string,
    result: ExecutionResult
  ): Promise<void> {
    if (effect.includes('->')) {
      const [condition, consequence] = effect.split('->').map(s => s.trim());
      
      const conditionMet = this.evaluateCondition(condition, {
        state,
        variables: Object.fromEntries(state.variables.entries())
      });
      
      if (conditionMet) {
        if (consequence === 'GameOver') {
          this.stateManager.updateVariable(specificationId, 'GameOver', true);
          result.changes.push({
            type: 'variable',
            target: 'global',
            property: 'GameOver',
            oldValue: false,
            newValue: true
          });
        } else if (consequence === 'LevelComplete') {
          this.stateManager.updateVariable(specificationId, 'LevelComplete', true);
          result.changes.push({
            type: 'variable',
            target: 'global',
            property: 'LevelComplete',
            oldValue: false,
            newValue: true
          });
        }
      }
    }
  }

  private evaluateCondition(condition: string, context: any): boolean {
    try {
      // Simple condition evaluator
      if (condition.includes('∧')) {
        return condition.split('∧').every(part => this.evaluateCondition(part.trim(), context));
      }
      if (condition.includes('∨')) {
        return condition.split('∨').some(part => this.evaluateCondition(part.trim(), context));
      }
      if (condition.includes('->')) {
        const [antecedent, consequent] = condition.split('->').map(s => s.trim());
        return !this.evaluateCondition(antecedent, context) || this.evaluateCondition(consequent, context);
      }
      if (condition.includes('>') || condition.includes('<') || condition.includes('==')) {
        return this.evaluateComparison(condition, context);
      }
      
      // Simple boolean value
      const value = this.evaluateValue(condition, context);
      return Boolean(value);
    } catch {
      return false;
    }
  }

  private evaluateComparison(expression: string, context: any): boolean {
    const operators = ['>=', '<=', '>', '<', '==', '!='];
    
    for (const op of operators) {
      if (expression.includes(op)) {
        const [left, right] = expression.split(op).map(s => s.trim());
        const leftValue = this.evaluateValue(left, context);
        const rightValue = this.evaluateValue(right, context);
        
        switch (op) {
          case '>': return leftValue > rightValue;
          case '<': return leftValue < rightValue;
          case '>=': return leftValue >= rightValue;
          case '<=': return leftValue <= rightValue;
          case '==': return leftValue === rightValue;
          case '!=': return leftValue !== rightValue;
        }
      }
    }
    
    return false;
  }

  private evaluateValue(expression: string, context: any): any {
    if (!expression) return undefined;
    
    // Remove whitespace
    expression = expression.trim();
    
    // Handle numbers
    const num = Number(expression);
    if (!isNaN(num)) return num;
    
    // Handle booleans
    if (expression === 'true') return true;
    if (expression === 'false') return false;
    
    // Handle property access (Entity.Property)
    if (expression.includes('.')) {
      const [obj, prop] = expression.split('.');
      
      if (obj === 'Self' && context.Self) {
        return context.Self[prop];
      }
      if (obj === 'Target' && context.Target) {
        return context.Target[prop];
      }
      if (context.variables && context.variables[obj] !== undefined) {
        return context.variables[obj];
      }
    }
    
    // Handle function calls
    if (expression.includes('(') && expression.includes(')')) {
      return this.evaluateFunction(expression, context);
    }
    
    // Handle variables
    if (context.variables && context.variables[expression] !== undefined) {
      return context.variables[expression];
    }
    
    return expression;
  }

  private evaluateFunction(expression: string, context: any): any {
    const match = expression.match(/(\w+)\(([^)]*)\)/);
    if (!match) return undefined;
    
    const funcName = match[1];
    const argsStr = match[2];
    const args = argsStr ? argsStr.split(',').map(arg => 
      this.evaluateValue(arg.trim(), context)) : [];
    
    switch (funcName) {
      case 'Rand':
        if (args.length >= 2) {
          const [min, max] = args;
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        break;
      case 'Min':
        if (args.length >= 2) {
          return Math.min(...args);
        }
        break;
      case 'Max':
        if (args.length >= 2) {
          return Math.max(...args);
        }
        break;
    }
    
    return undefined;
  }

  private parseExpression(expression: string): any {
    expression = expression.trim();
    
    // Assignment (property = value)
    if (expression.includes('=') && !expression.includes('+=') && !expression.includes('-=')) {
      const [left, right] = expression.split('=').map(s => s.trim());
      const [target, property] = left.split('.').map(s => s.trim());
      
      return {
        type: 'assignment',
        target,
        property,
        value: right
      };
    }
    
    // Modification (property += value or property -= value)
    const modificationMatch = expression.match(/(\w+)\.(\w+)\s*([+\-*/]=)\s*(.+)/);
    if (modificationMatch) {
      const [_, target, property, operator, value] = modificationMatch;
      return {
        type: 'modification',
        target,
        property,
        operator,
        value
      };
    }
    
    // Function call
    if (expression.includes('(') && expression.includes(')')) {
      return {
        type: 'function_call',
        expression
      };
    }
    
    return {
      type: 'unknown',
      expression
    };
  }

  private async checkTemporalConstraint(constraint: any, state: any, specificationId: string): Promise<boolean> {
    // Simplified temporal constraint checking
    // In a full implementation, this would analyze state history
    const { operator, expression } = constraint;
    
    const currentValue = this.evaluateValue(expression, {
      state,
      variables: Object.fromEntries(state.variables.entries())
    });
    
    switch (operator) {
      case 'G': // Globally
        // For now, check if it's currently true
        return Boolean(currentValue);
      case 'F': // Eventually
        // For now, assume it will eventually be true
        return true;
      case 'X': // Next
        // For now, assume it will be true in the next step
        return true;
      default:
        return false;
    }
  }

  private async calculateProbability(expression: string, state: any, specificationId: string): Promise<number> {
    // Simplified probability calculation
    // In a full implementation, this would use statistical analysis
    return 0.5;
  }

  private compareProbability(probability: number, operator: string, threshold: number): boolean {
    switch (operator) {
      case '>': return probability > threshold;
      case '<': return probability < threshold;
      case '>=': return probability >= threshold;
      case '<=': return probability <= threshold;
      case '==': return probability === threshold;
      default: return false;
    }
  }

  private async applyStructuredEffect(
    effect: any,
    sourceInstance: any,
    state: any,
    targetType: string | undefined,
    specificationId: string,
    result: ExecutionResult
  ): Promise<void> {
    // Handle structured effect objects
    if (effect.type === 'create_entity') {
      await this.createEntity(effect, state, specificationId, result);
    } else if (effect.type === 'remove_entity') {
      await this.removeEntity(effect, state, specificationId, result);
    } else if (effect.type === 'modify_multiple') {
      await this.modifyMultiple(effect, sourceInstance, state, targetType, specificationId, result);
    }
  }

  private async createEntity(
    effect: any,
    state: any,
    specificationId: string,
    result: ExecutionResult
  ): Promise<void> {
    const { entityType, properties } = effect;
    const instanceId = this.stateManager.createEntityInstance(specificationId, entityType, properties);
    
    result.changes.push({
      type: 'create_entity',
      target: instanceId,
      oldValue: null,
      newValue: { entityType, properties }
    });
  }

  private async removeEntity(
    effect: any,
    state: any,
    specificationId: string,
    result: ExecutionResult
  ): Promise<void> {
    const { entityType, instanceId } = effect;
    const success = this.stateManager.removeEntityInstance(specificationId, entityType, instanceId);
    
    if (success) {
      result.changes.push({
        type: 'remove_entity',
        target: instanceId,
        oldValue: { entityType },
        newValue: null
      });
    }
  }

  private async modifyMultiple(
    effect: any,
    sourceInstance: any,
    state: any,
    targetType: string | undefined,
    specificationId: string,
    result: ExecutionResult
  ): Promise<void> {
    const { modifications } = effect;
    
    for (const mod of modifications) {
      await this.applyEffect(
        mod,
        sourceInstance,
        state,
        targetType,
        specificationId,
        result
      );
    }
  }
}