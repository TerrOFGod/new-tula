import React, { useState } from "react";
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from "reactflow";

export default function ProbabilisticEdge(props: EdgeProps) {
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
  const [probability, setProbability] = useState(data.probability || 0.5);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProbability(val);
    // Здесь можно вызвать функцию обновления данных ребра (например, через стор)
    // onEdgeDataChange? id, { probability: val }
  };

  return (
    <>
      <path
        id={id}
        style={{ stroke: '#ff6b6b', strokeWidth: 2 }}
        d={edgePath}
        markerEnd={props.markerEnd}
      />
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
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={probability}
            onChange={handleChange}
            style={{ width: '50px' }}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}