"use client";
import { memo } from "react";
import { Handle, Position, NodeResizer } from "reactflow";
import { StructType } from "@/app/types/structs";

interface StateNodeProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
    valueType?: 'int' | 'enum' | 'list';
    range?: [number, number];
    enumValues?: string[];
  };
  selected: boolean;
}

const StateNode = memo(({ data, selected }: StateNodeProps) => {
  const { name, label, valueType, range, enumValues } = data;
  return (
    <div>
      <NodeResizer color="#4A90E2" isVisible={selected} minWidth={80} minHeight={50} />
      <Handle type="target" position={Position.Left} />
      <div style={{
        border: '2px solid #4A90E2',
        borderRadius: '4px',
        padding: '5px',
        background: '#fff'
      }}>
        <div>{name || label}</div>
        {valueType === 'int' && range && <div>{range[0]}-{range[1]}</div>}
        {valueType === 'enum' && enumValues && <div>{enumValues.join(', ')}</div>}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

StateNode.displayName = "StateNode";
export default StateNode;