export interface ExecutionContext {
  specificationId: string;
  entityType?: string;
  instanceId?: string;
  event?: any;
  rule?: any;
  state: GameState; // обязательно
}