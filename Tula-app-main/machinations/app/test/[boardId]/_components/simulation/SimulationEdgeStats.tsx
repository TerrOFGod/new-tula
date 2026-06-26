"use client";

import {
  formatSimulationPercent,
  useSimulationResults,
} from "@/app/store/use-simulation-results";

interface SimulationEdgeStatsProps {
  sourceId: string;
  targetId: string;
  labelX: number;
  labelY: number;
  offsetY?: number;
}

export const SimulationEdgeStats = ({
  sourceId,
  targetId,
  labelX,
  labelY,
  offsetY = 28,
}: SimulationEdgeStatsProps) => {
  const probability = useSimulationResults((state) =>
    state.getEdgeTransition(sourceId, targetId)
  );
  const isActive = useSimulationResults((state) => state.isActive);
  const mode = useSimulationResults((state) => state.mode);

  if (!isActive || mode !== "MARKOV_CHAIN" || probability === undefined) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY + offsetY}px)`,
        pointerEvents: "none",
      }}
      className="simulation-edge-stats"
    >
      <div
        className="sim-stat sim-stat-transition"
        title="Transition probability"
      >
        {formatSimulationPercent(probability)}
      </div>
    </div>
  );
};
