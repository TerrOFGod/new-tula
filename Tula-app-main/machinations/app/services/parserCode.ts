const parseCodeToTemplate = (code: string) => {
  try {
    const parsedData = JSON.parse(code);

    const description = parsedData.description || "";
    const edgeType = parsedData.edge_type || "";
    const iterationCounts = parsedData.iteration_counts || 0;
    const timeStep = parsedData.time_step || 0;
    const gamesCount = parsedData.games_count || 0;
    const elements = parsedData.elements || [];

    return {
      description,
      edgeType,
      iterationCounts,
      timeStep,
      gamesCount,
      elements,
    };
  } catch (error) {
    console.error("Error parsing code:", error);
    return null;
  }
};

export { parseCodeToTemplate };
