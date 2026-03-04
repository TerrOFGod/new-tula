import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import useStore from "@/app/store/store";
import React, { useEffect, useState } from "react";

import {
  BaseEdge,
  BezierEdge,
  EdgeLabelRenderer,
  EdgeProps,
  StepEdge,
  getBezierPath,
  getStraightPath,
} from "reactflow";

export default function CustomEdge(props: EdgeProps) {
  const {
    error,
    setError,
    currentEdgesType: currentType,
  } = useChangeEdgeType();
  const [localError, setLocalError] = useState<string | null>(null);

  const { setEdgeData } = useStore();
  const {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    id,
    data: initalValue,
  } = props;

  const [inputValue, setInputValue] = useState<number>(initalValue ?? 1);
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

  const onChange = (event: any) => {
    const newValue = event.target.value;

    if (typeof +newValue !== "number" || isNaN(+newValue)) {
      setLocalError("Must be a numeric");
      setError("error");
      setInputValue(newValue);
    } else {
      setLocalError(null);
      setError(null);
      setInputValue(newValue);
      setEdgeData(id, +newValue);
    }
  };

  useEffect(() => {
    if (typeof +inputValue !== "number" || isNaN(+inputValue)) {
      setLocalError("Must be a numeric");
      setError("error");
    } else {
      setLocalError(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initalValue]);

  return (
    <>
      {currentType === "SmoothStep" && <StepEdge {...props} />}
      {currentType === "Default" && <BaseEdge path={basePath} {...props} />}
      {currentType == "Bezier" && <BezierEdge {...props} />}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <input
            className={
              localError
                ? "border-2 border-red-500 w-16 h-7 text-center rounded-sm"
                : "w-16 h-7 text-center rounded-sm"
            }
            value={inputValue}
            onChange={onChange}
          />
          {localError && (
            <p className="text-center text-2 font-bold text-red-500">
              {localError}
            </p>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
