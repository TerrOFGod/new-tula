"use client";

import { Panel } from "reactflow";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import useStore from "@/app/store/store";
import {
  formatSimulationPercent,
  useSimulationResults,
} from "@/app/store/use-simulation-results";

const getNodeLabel = (
  nodeId: string,
  nodes: ReturnType<typeof useStore.getState>["nodes"]
) => {
  const node = nodes.find((item) => item.id === nodeId);

  if (!node) {
    return nodeId.slice(0, 8);
  }

  if (node.data?.name) {
    return node.data.name;
  }

  if (node.data?.struct) {
    return node.data.struct;
  }

  return nodeId.slice(0, 8);
};

const formatPathLabel = (
  nodeIds: string[],
  nodes: ReturnType<typeof useStore.getState>["nodes"]
) => {
  return nodeIds.map((nodeId) => getNodeLabel(nodeId, nodes)).join(" → ");
};

export const SimulationResultsPanel = () => {
  const nodes = useStore((state) => state.nodes);
  const {
    isActive,
    mode,
    runs,
    paths,
    transitions,
    stateProbabilities,
    clear,
  } = useSimulationResults();

  if (!isActive) {
    return null;
  }

  const isMarkov = mode === "MARKOV_CHAIN";
  const subtitle = isMarkov
    ? `${mode.replace(/_/g, " ")} · steady-state`
    : `${mode?.replace(/_/g, " ")} · ${runs} runs`;
  const visibleStateProbabilities = stateProbabilities.filter(
    (entry) => entry.probability > 0
  );

  return (
    <Panel position="top-right" className="info_panel">
      <div className="simulation-results-panel">
        <div className="simulation-results-header">
          <div>
            <h3 className="simulation-results-title">Simulation Results</h3>
            <p className="simulation-results-subtitle">{subtitle}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clear}
            aria-label="Clear simulation results"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {isMarkov && (
          <>
            <div className="simulation-results-section">
              <h4 className="simulation-results-section-title">
                State Probabilities
              </h4>
              <div className="simulation-path-list">
                {visibleStateProbabilities.length === 0 && (
                  <p className="simulation-path-empty">No state data returned</p>
                )}
                {visibleStateProbabilities.map((entry) => (
                  <div
                    key={entry.nodeId}
                    className="simulation-path-item simulation-markov-state-item"
                  >
                    <div className="simulation-path-meta">
                      <span className="simulation-path-prob sim-stat-state-inline">
                        {formatSimulationPercent(entry.probability)}
                      </span>
                    </div>
                    <div className="simulation-path-label">
                      {getNodeLabel(entry.nodeId, nodes)}
                    </div>
                    <div
                      className="simulation-probability-bar"
                      style={{
                        width: `${Math.max(entry.probability * 100, 0)}%`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="simulation-results-section">
              <h4 className="simulation-results-section-title">Transitions</h4>
              <div className="simulation-path-list">
                {transitions.length === 0 && (
                  <p className="simulation-path-empty">
                    No transition matrix returned
                  </p>
                )}
                {transitions.map((entry) => (
                  <div
                    key={`${entry.sourceId}-${entry.targetId}`}
                    className="simulation-path-item"
                  >
                    <div className="simulation-path-meta">
                      <span className="simulation-path-prob sim-stat-transition-inline">
                        {formatSimulationPercent(entry.probability)}
                      </span>
                    </div>
                    <div className="simulation-path-label">
                      {getNodeLabel(entry.sourceId, nodes)}
                      {entry.sourceId === entry.targetId ? " ↺" : " → "}
                      {entry.sourceId !== entry.targetId &&
                        getNodeLabel(entry.targetId, nodes)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {!isMarkov && (
          <div className="simulation-results-section">
            <h4 className="simulation-results-section-title">Top Paths</h4>
            <div className="simulation-path-list">
              {paths.length === 0 && (
                <p className="simulation-path-empty">No paths returned</p>
              )}
              {paths.map((path) => (
                <div key={path.pathKey} className="simulation-path-item">
                  <div className="simulation-path-meta">
                    <span className="simulation-path-count">{path.count}</span>
                    <span className="simulation-path-prob">
                      {formatSimulationPercent(path.probability)}
                    </span>
                  </div>
                  <div className="simulation-path-label">
                    {formatPathLabel(path.nodeIds, nodes)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button type="button" variant="outline" className="w-full" onClick={clear}>
          Clear Results
        </Button>
      </div>
    </Panel>
  );
};
