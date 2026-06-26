import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import React, { useState } from "react";
import { SimulationEdgeStats } from "@/app/test/[boardId]/_components/simulation/SimulationEdgeStats";
import { useSimulationResults } from "@/app/store/use-simulation-results";
import { EdgeProps, getBezierPath, EdgeLabelRenderer, getStraightPath, BaseEdge, BezierEdge, StepEdge } from "reactflow";

export default function ProbabilisticEdge(props: EdgeProps) {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data = {},
    style,
    id,
    source,
    target,
  } = props;

  const {
    error,
    setError,
    currentEdgesType: currentType,
  } = useChangeEdgeType();

  const [probability, setProbability] = useState(data.probability || 0.5);
  const transitionProbability = useSimulationResults((state) =>
    state.getEdgeTransition(source, target)
  );
  const isMarkovActive = useSimulationResults(
    (state) => state.isActive && state.mode === "MARKOV_CHAIN"
  );
  const edgeStrokeWidth =
    isMarkovActive && transitionProbability !== undefined
      ? 1.5 + transitionProbability * 4
      : 2;
  const edgeVisualStyle = {
    ...style,
    stroke: isMarkovActive && transitionProbability !== undefined ? "#7c3aed" : "#ff6b6b",
    strokeWidth: edgeStrokeWidth,
    strokeDasharray: "5,5",
  };

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [basePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProbability(val);
    // Здесь можно вызвать функцию обновления данных ребра (например, через стор)
    // onEdgeDataChange? id, { probability: val }
  };

  return (
    <>
      {currentType === "SmoothStep" && <StepEdge {...props} style={edgeVisualStyle} />}
      {currentType === "Default" && <BaseEdge path={basePath} {...props} style={edgeVisualStyle} />}
      {currentType == "Bezier" && <BezierEdge {...props} style={edgeVisualStyle} />}

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: '#fff',
            padding: '2px 4px',
            borderRadius: '4px',
            border: '1px solid #ff6b6b',
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <input
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={probability}
            onChange={handleChange}
            style={{ width: '50px', border: "none", outline: "none" }}
          />
        </div>
        <SimulationEdgeStats
          sourceId={source}
          targetId={target}
          labelX={labelX}
          labelY={labelY}
        />
      </EdgeLabelRenderer>
    </>
  );
}