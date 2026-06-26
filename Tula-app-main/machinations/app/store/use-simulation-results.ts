import { create } from "zustand";

export type TransitionMatrix = Record<string, Record<string, number>>;
export type StateProbabilities = Record<string, number>;

export interface SimulationResult {
  runs: number;
  finalNodeCounts: Record<string, number> | null;
  finalNodeProbabilities: Record<string, number> | null;
  nodeVisitCounts: Record<string, number> | null;
  pathCounts: Record<string, number> | null;
  transitionMatrix: TransitionMatrix | null;
  stateProbabilities: StateProbabilities | null;
}

export interface NodeSimulationStats {
  visits?: number;
  finalCount?: number;
  probability?: number;
  stateProbability?: number;
}

export interface SimulationPathEntry {
  pathKey: string;
  nodeIds: string[];
  count: number;
  probability: number;
}

export interface TransitionEntry {
  sourceId: string;
  targetId: string;
  probability: number;
}

export interface StateProbabilityEntry {
  nodeId: string;
  probability: number;
}

const edgeKey = (sourceId: string, targetId: string) =>
  `${sourceId}::${targetId}`;

interface SimulationResultsState {
  isActive: boolean;
  mode: string | null;
  runs: number;
  nodeStats: Record<string, NodeSimulationStats>;
  edgeStats: Record<string, { probability: number }>;
  paths: SimulationPathEntry[];
  transitions: TransitionEntry[];
  stateProbabilities: StateProbabilityEntry[];
  getEdgeTransition: (sourceId: string, targetId: string) => number | undefined;
  applyResult: (mode: string, result: SimulationResult) => void;
  clear: () => void;
}

const buildMonteCarloNodeStats = (
  result: SimulationResult
): Record<string, NodeSimulationStats> => {
  const nodeIds = new Set([
    ...Object.keys(result.nodeVisitCounts ?? {}),
    ...Object.keys(result.finalNodeCounts ?? {}),
    ...Object.keys(result.finalNodeProbabilities ?? {}),
  ]);

  const stats: Record<string, NodeSimulationStats> = {};

  nodeIds.forEach((nodeId) => {
    stats[nodeId] = {
      visits: result.nodeVisitCounts?.[nodeId],
      finalCount: result.finalNodeCounts?.[nodeId],
      probability: result.finalNodeProbabilities?.[nodeId],
    };
  });

  return stats;
};

const buildMarkovNodeStats = (
  result: SimulationResult
): Record<string, NodeSimulationStats> => {
  const stats: Record<string, NodeSimulationStats> = {};

  Object.entries(result.stateProbabilities ?? {}).forEach(([nodeId, probability]) => {
    stats[nodeId] = { stateProbability: probability };
  });

  return stats;
};

const buildEdgeStats = (
  matrix: TransitionMatrix | null
): Record<string, { probability: number }> => {
  const stats: Record<string, { probability: number }> = {};

  Object.entries(matrix ?? {}).forEach(([sourceId, targets]) => {
    Object.entries(targets).forEach(([targetId, probability]) => {
      stats[edgeKey(sourceId, targetId)] = { probability };
    });
  });

  return stats;
};

const buildPaths = (result: SimulationResult): SimulationPathEntry[] => {
  const runs = result.runs || 1;

  return Object.entries(result.pathCounts ?? {})
    .map(([pathKey, count]) => ({
      pathKey,
      nodeIds: pathKey.split(" -> ").map((id) => id.trim()),
      count,
      probability: count / runs,
    }))
    .sort((a, b) => b.count - a.count);
};

const buildTransitions = (
  matrix: TransitionMatrix | null
): TransitionEntry[] => {
  return Object.entries(matrix ?? {})
    .flatMap(([sourceId, targets]) =>
      Object.entries(targets).map(([targetId, probability]) => ({
        sourceId,
        targetId,
        probability,
      }))
    )
    .sort((a, b) => b.probability - a.probability);
};

const buildStateProbabilities = (
  probabilities: StateProbabilities | null
): StateProbabilityEntry[] => {
  return Object.entries(probabilities ?? {})
    .map(([nodeId, probability]) => ({ nodeId, probability }))
    .sort((a, b) => b.probability - a.probability);
};

export const isMonteCarloResult = (
  value: unknown
): value is SimulationResult => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const result = value as SimulationResult;
  return (
    result.nodeVisitCounts !== null &&
    typeof result.nodeVisitCounts === "object"
  );
};

export const isMarkovChainResult = (
  value: unknown
): value is SimulationResult => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const result = value as SimulationResult;
  return (
    result.transitionMatrix !== null &&
    typeof result.transitionMatrix === "object"
  );
};

export const useSimulationResults = create<SimulationResultsState>((set, get) => ({
  isActive: false,
  mode: null,
  runs: 0,
  nodeStats: {},
  edgeStats: {},
  paths: [],
  transitions: [],
  stateProbabilities: [],
  getEdgeTransition: (sourceId, targetId) =>
    get().edgeStats[edgeKey(sourceId, targetId)]?.probability,
  applyResult: (mode, result) => {
    if (isMarkovChainResult(result)) {
      set({
        isActive: true,
        mode,
        runs: result.runs,
        nodeStats: buildMarkovNodeStats(result),
        edgeStats: buildEdgeStats(result.transitionMatrix),
        paths: [],
        transitions: buildTransitions(result.transitionMatrix),
        stateProbabilities: buildStateProbabilities(result.stateProbabilities),
      });
      return;
    }

    if (isMonteCarloResult(result)) {
      set({
        isActive: true,
        mode,
        runs: result.runs,
        nodeStats: buildMonteCarloNodeStats(result),
        edgeStats: {},
        paths: buildPaths(result),
        transitions: [],
        stateProbabilities: [],
      });
    }
  },
  clear: () => {
    set({
      isActive: false,
      mode: null,
      runs: 0,
      nodeStats: {},
      edgeStats: {},
      paths: [],
      transitions: [],
      stateProbabilities: [],
    });
  },
}));

export const formatSimulationPercent = (value: number) => {
  const percent = value * 100;

  if (percent > 0 && percent < 1) {
    return `${percent.toFixed(1)}%`;
  }

  return `${Math.round(percent)}%`;
};
