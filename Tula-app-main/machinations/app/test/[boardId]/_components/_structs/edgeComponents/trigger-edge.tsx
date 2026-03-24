// app/test/[boardId]/_components/_structs/trigger-edge.tsx
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import React, { useState } from "react";
import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge, getStraightPath, BezierEdge, StepEdge } from '@xyflow/react';

export default function TriggerEdge(props: EdgeProps) {
    const {
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        data = {},
        id,
        style,
    } = props;

    const {
        error,
        setError,
        currentEdgesType: currentType,
    } = useChangeEdgeType();

    const [eventName, setEventName] = useState(String(data.eventName) || "");

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
        setEventName(e.target.value);
        // Здесь можно обновить данные ребра через стор, но пока оставим
    };

    return (
        <>
            {currentType === "SmoothStep" && <StepEdge {...props}  style={{ ...style, stroke: '#f97316', strokeWidth: 2, strokeDasharray: '5,5' }}/>}
            {currentType === "Default" && <BaseEdge path={basePath} {...props}  style={{ ...style, stroke: '#f97316', strokeWidth: 2, strokeDasharray: '5,5' }}/>}
            {currentType == "Bezier" && <BezierEdge {...props}  style={{ ...style, stroke: '#f97316', strokeWidth: 2, strokeDasharray: '5,5' }}/>}

            <EdgeLabelRenderer>
                <div
                    style={{
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        background: "#fff",
                        padding: "2px 4px",
                        borderRadius: "4px",
                        border: "1px solid #f97316",
                        fontSize: 12,
                        pointerEvents: "all",
                    }}
                    className="nodrag nopan"
                >
                    <input
                        type="text"
                        placeholder="event"
                        value={eventName}
                        onChange={handleChange}
                        style={{ width: "80px", border: "none", outline: "none" }}
                    />
                </div>
            </EdgeLabelRenderer>
        </>
    );
}