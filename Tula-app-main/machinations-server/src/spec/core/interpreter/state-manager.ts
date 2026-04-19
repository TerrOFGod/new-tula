import { Injectable } from "@nestjs/common";

@Injectable()
export class StateManager {
  private readonly states = new Map<string, any>();

  createState(specificationId: string, entities: any[]): any {
    const state = {
      specificationId,
      entities,
      createdAt: new Date().toISOString(),
    };
    this.states.set(specificationId, state);
    return state;
  }

  getState(specificationId: string): any | undefined {
    return this.states.get(specificationId);
  }

  resetState(specificationId: string): void {
    this.states.delete(specificationId);
  }
}
