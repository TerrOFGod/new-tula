import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import { ConnectionType } from "@/app/types/structs";
import React, { useState } from "react";
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
  } = props;

  const edgeStyle = {
    ...style, stroke: '#ff6b6b', strokeWidth: 2,
    strokeDasharray: data.connectionType === ConnectionType.TRIGGER ? '5,5' : 'none',
    // можно также задать цвет или другие отличия
  };

  const {
    error,
    setError,
    currentEdgesType: currentType,
  } = useChangeEdgeType();

  const [probability, setProbability] = useState(data.probability || 0.5);

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
      {currentType === "SmoothStep" && <StepEdge {...props}  style={edgeStyle}/>}
      {currentType === "Default" && <BaseEdge path={basePath} {...props}  style={edgeStyle}/>}
      {currentType == "Bezier" && <BezierEdge {...props}  style={edgeStyle}/>}

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