"use client";

import {
  formatSimulationPercent,
  useSimulationResults,
} from "@/app/store/use-simulation-results";

interface SimulationNodeStatsProps {
  nodeId: string;
}

export const SimulationNodeStats = ({ nodeId }: SimulationNodeStatsProps) => {
  const stats = useSimulationResults((state) => state.nodeStats[nodeId]);
  const isActive = useSimulationResults((state) => state.isActive);
  const mode = useSimulationResults((state) => state.mode);

  if (!isActive || !stats) {
    return null;
  }

  const hasVisits = stats.visits !== undefined;
  const hasProbability = stats.probability !== undefined;
  const hasFinalCount = stats.finalCount !== undefined;
  const hasStateProbability = stats.stateProbability !== undefined;

  if (
    !hasVisits &&
    !hasProbability &&
    !hasFinalCount &&
    !hasStateProbability
  ) {
    return null;
  }

  return (
    <div className="simulation-node-stats">
      {hasVisits && (
        <div className="sim-stat sim-stat-visits" title="Visit count">
          {stats.visits}
        </div>
      )}
      {hasStateProbability && stats.stateProbability! > 0 && (
        <div
          className="sim-stat sim-stat-state"
          title="Steady-state probability"
        >
          {formatSimulationPercent(stats.stateProbability!)}
        </div>
      )}
      {hasProbability && mode !== "MARKOV_CHAIN" && (
        <div className="sim-stat sim-stat-prob" title="Final probability">
          {formatSimulationPercent(stats.probability!)}
        </div>
      )}
      {hasFinalCount && !hasVisits && (
        <div className="sim-stat sim-stat-final" title="Final count">
          {stats.finalCount}
        </div>
      )}
    </div>
  );
};

export const useSimulationNodeHighlight = (nodeId: string) => {
  const stats = useSimulationResults((state) => state.nodeStats[nodeId]);
  const isActive = useSimulationResults((state) => state.isActive);
  const mode = useSimulationResults((state) => state.mode);

  if (
    !isActive ||
    mode !== "MARKOV_CHAIN" ||
    stats?.stateProbability === undefined
  ) {
    return false;
  }

  return stats.stateProbability > 0;
};
