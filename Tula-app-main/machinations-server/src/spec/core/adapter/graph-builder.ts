import { Injectable } from "@nestjs/common";

@Injectable()
export class GraphBuilder {
  buildGraph(specification: any): any {
    return {
      nodes: specification?.entities ?? [],
      edges: [],
    };
  }

  updateGraphWithState(graph: any, state: any): any {
    return {
      ...graph,
      state,
    };
  }
}
