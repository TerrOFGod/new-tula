export interface GraphMetadata {
  entityCount: number;
  eventCount: number;
  ruleCount: number;
  generatedAt: Date;
  specificationId?: string;
  updatedAt?: Date; // добавим поле, чтобы избежать ошибки
}