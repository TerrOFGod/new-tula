import { Injectable } from "@nestjs/common";

@Injectable()
export class EntityParser {
  parseEntity(source: string): { entities: any[]; rules: any[] } {
    return {
      entities: [],
      rules: [],
    };
  }
}
