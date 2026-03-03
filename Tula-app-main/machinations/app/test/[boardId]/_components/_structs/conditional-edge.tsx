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
      {currentType === "SmoothStep" && <StepEdge {...props}  style={{ ...props.style, stroke: '#4A90E2', strokeWidth: 2, strokeDasharray: '5,5' }}/>}
      {currentType === "Default" && <BaseEdge style={{ ...props.style, stroke: '#4A90E2', strokeWidth: 2, strokeDasharray: '5,5' }} path={basePath} {...props} />}
      {currentType == "Bezier" && <BezierEdge style={{ ...props.style, stroke: '#4A90E2', strokeWidth: 2, strokeDasharray: '5,5' }} {...props} />}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: '#fff',
            padding: '2px 4px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <input
            type="text"
            placeholder="condition"
            value={condition}
            onChange={handleChange}
            style={{ width: '100px' }}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}