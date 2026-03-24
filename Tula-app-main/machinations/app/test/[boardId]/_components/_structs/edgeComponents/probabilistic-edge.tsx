import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import React, { useState } from "react";
import { EdgeProps, getBezierPath, EdgeLabelRenderer, getStraightPath, BaseEdge, BezierEdge, StepEdge } from '@xyflow/react';

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
  } = props;

  const {
    error,
    setError,
    currentEdgesType: currentType,
  } = useChangeEdgeType();

  const [probability, setProbability] = useState(Number(data.probability) || 0.5);

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
      {currentType === "SmoothStep" && <StepEdge {...props}  style={{ ...style, stroke: '#ff6b6b', strokeWidth: 2, strokeDasharray: '5,5' }}/>}
      {currentType === "Default" && <BaseEdge path={basePath} {...props}  style={{ ...style, stroke: '#ff6b6b', strokeWidth: 2, strokeDasharray: '5,5' }}/>}
      {currentType == "Bezier" && <BezierEdge {...props}  style={{ ...style, stroke: '#ff6b6b', strokeWidth: 2, strokeDasharray: '5,5' }}/>}

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
      </EdgeLabelRenderer>
    </>
  );
}