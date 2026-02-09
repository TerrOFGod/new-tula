export const parserToJson = (
  description: string,
  currentType: string,
  iterations: number,
  games: number,
  time: number,
  getNodesJson: any,
  getEdgesJson: any
): string => {
  const nodesJson = getNodesJson().join(",\n    ");
  const edgesJson = getEdgesJson().join(",\n    ");

  return `{
  "description": "${description}",
  "edge_type": "${currentType.toLowerCase()}",
  "iteration_counts": ${iterations},
  "time_step": ${time},
  "games_count": ${games},
  "elements": [
    ${nodesJson},
    ${edgesJson}
    ]
}`;
};
