"use client";
import { memo } from "react";
import { Handle, Position, NodeResizer } from "reactflow";
import { StructType } from "@/app/types/structs";

interface RuleNodeProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
    when?: string;
    effect?: string;
  };
  selected: boolean;
}

const RuleNode = memo(({ data, selected }: RuleNodeProps) => {
  const { name, label, when, effect } = data;
  return (
    <div>
      <NodeResizer color="#4A90E2" isVisible={selected} minWidth={100} minHeight={60} />
      <Handle type="target" position={Position.Left} />
      <div style={{
        border: '2px solid #4A90E2',
        borderRadius: '8px',
        padding: '8px',
        background: '#e6ffe6'
      }}>
        <div>{name || label}</div>
        {when && <div style={{ fontSize: '0.7rem' }}>When: {when}</div>}
        {effect && <div style={{ fontSize: '0.7rem' }}>Effect: {effect}</div>}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

RuleNode.displayName = "RuleNode";
export default RuleNode;