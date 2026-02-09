import { useGenerate } from "../store/useBoardInfo";
import { EdgesTypes } from "../types/structs";

export interface ITemplate {
  description: string;
  edgeType: EdgesTypes;
  iterationCounts: number;
  timeStep: number;
  gamesCount: number;
  elements: any;
}
export const generateSheme = (
  template: ITemplate | null,
  setDescription: (text: string) => void,
  onChangeEdgesType: (type: EdgesTypes) => void,
  setGames: (count: number) => void,
  setIterations: (count: number) => void,
  setTime: (count: number) => void,
  generateNode: any,
  generateEdge: (
    id: number,
    source: number,
    target: number,
    value: number
  ) => void
) => {
  let type: EdgesTypes | null = EdgesTypes.DEFAULT;

  if (template) {
    if (template.edgeType === EdgesTypes.DEFAULT) type = EdgesTypes.DEFAULT;
    if (template.edgeType === EdgesTypes.SMOOTH_STEP)
      type = EdgesTypes.SMOOTH_STEP;
    if (template.edgeType === EdgesTypes.BEZIER) type = EdgesTypes.BEZIER;

    setDescription(template.description);
    onChangeEdgesType(type);
    setGames(template.gamesCount);
    setIterations(template.iterationCounts);
    setTime(template.timeStep);

    template.elements.map((el: any) => {
      el.element_type === "node"
        ? generateNode(
            el.id,
            el.struct,
            el.label,
            el.position.data.x,
            el.position.data.y
          )
        : "close";
    });

    template.elements.map((el: any) => {
      el.element_type === "edge"
        ? generateEdge(el.id, el.source_id, el.target_id, el.value)
        : "close";
    });
  }
  return "no correct data";
};
