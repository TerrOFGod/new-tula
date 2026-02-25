"use client";
import { memo, useState } from "react";
import { Handle, Position, NodeResizer } from "reactflow";
import { useNodeDetails } from "@/app/store/use-node-details";
import { StructType } from "@/app/types/structs";

interface EntityNodeProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
    states?: string[];
    events?: string[];
  };
  selected: boolean;
  id: string;
}

const EntityNode = memo(({ data, selected, id }: EntityNodeProps) => {
  const { name, label, states, events } = data;
  const [isHovered, setIsHovered] = useState(false);
  const { openDetails } = useNodeDetails();

  return (
    <div
      onDoubleClick={() => openDetails(id, 'entity')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NodeResizer color="#4A90E2" isVisible={selected} minWidth={120} minHeight={80} />
      <Handle type="target" position={Position.Top} />
      <div className="entity-node" style={{
        border: '2px solid #4A90E2',
        borderRadius: '8px',
        padding: '10px',
        background: '#f0f8ff'
      }}>
        <div style={{ fontWeight: 'bold' }}>{name || label}</div>
        {isHovered && (
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            {states?.length || 0} states, {events?.length || 0} events
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

EntityNode.displayName = "EntityNode";
export default EntityNode;