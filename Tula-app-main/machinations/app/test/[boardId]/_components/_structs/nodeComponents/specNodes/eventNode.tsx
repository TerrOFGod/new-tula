"use client";
import { memo } from "react";
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { StructType } from "@/app/types/structs";
import { useNodeDetails } from "@/app/store/use-node-details";

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
  id: string;
}

const EventNode = memo(({ data, selected, id }: EventNodeProps) => {
  const { name, label, requires, effect, probability } = data;
    const { openDetails } = useNodeDetails();
  return (
    <div onDoubleClick={() => openDetails(id, 'event')}>
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