import { Injectable } from "@nestjs/common";

@Injectable()
export class Executor {
  async executeEvent(context: any): Promise<any> {
    return {
      type: "event",
      success: true,
      context,
    };
  }

  async executeRule(context: any): Promise<any> {
    return {
      type: "rule",
      success: true,
      context,
    };
  }
}
