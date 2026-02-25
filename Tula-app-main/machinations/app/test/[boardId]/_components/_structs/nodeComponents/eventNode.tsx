"use client";
import { memo } from "react";
import { Handle, Position, NodeResizer } from "reactflow";
import { StructType } from "@/app/types/structs";

interface EventNodeProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
    requires?: string;
    effect?: string;
    probability?: number;
  };
  selected: boolean;
}

const EventNode = memo(({ data, selected }: EventNodeProps) => {
  const { name, label, requires, effect, probability } = data;
  return (
    <div>
      <NodeResizer color="#4A90E2" isVisible={selected} minWidth={100} minHeight={60} />
      <Handle type="target" position={Position.Top} />
      <div style={{
        border: '2px solid #4A90E2',
        borderRadius: '8px',
        padding: '8px',
        background: '#ffe4e1'
      }}>
        <div>{name || label}</div>
        {probability !== undefined && <div>P={probability}</div>}
        {requires && <div style={{ fontSize: '0.7rem' }}>Requires: {requires}</div>}
        {effect && <div style={{ fontSize: '0.7rem' }}>Effect: {effect}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

EventNode.displayName = "EventNode";
export default EventNode;