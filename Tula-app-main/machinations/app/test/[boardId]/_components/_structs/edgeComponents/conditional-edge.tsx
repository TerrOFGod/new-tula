import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import path from "path";
import React, { useState } from "react";
import { EdgeProps, getBezierPath, EdgeLabelRenderer, getStraightPath, BaseEdge, BezierEdge, StepEdge } from "reactflow";

export default function ConditionalEdge(props: EdgeProps) {
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
  const [condition, setCondition] = useState(data.condition || "");

  const {
    error,
    setError,
    currentEdgesType: currentType,
  } = useChangeEdgeType();

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
    setCondition(e.target.value);
    // обновить данные ребра
  };

  return (
    <>
      {currentType === "SmoothStep" && <StepEdge {...props}  style={{ ...style, stroke: '#4A90E2', strokeWidth: 2, strokeDasharray: '5,5' }}/>}
      {currentType === "Default" && <BaseEdge path={basePath} {...props} style={{ ...style, stroke: '#4A90E2', strokeWidth: 2, strokeDasharray: '5,5' }}/>}
      {currentType == "Bezier" && <BezierEdge {...props} style={{ ...style, stroke: '#4A90E2', strokeWidth: 2, strokeDasharray: '5,5' }}/>}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: '#fff',
            padding: '2px 4px',
            borderRadius: '4px',
            border: '1px solid #4A90E2',
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <input
            type="text"
            placeholder="condition"
            value={condition}
            onChange={handleChange}
            style={{ width: '80px', border: "none", outline: "none"  }}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}