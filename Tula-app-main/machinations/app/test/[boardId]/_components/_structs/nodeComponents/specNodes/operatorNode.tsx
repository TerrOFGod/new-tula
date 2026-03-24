"use client";
import { memo } from "react";
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { StructType } from "@/app/types/structs";
import { useNodeDetails } from "@/app/store/use-node-details";

const operatorSymbols = {
  X: '◯',
  F: '◇',
  G: '□',
  U: 'U',
};

interface OperatorNodeProps {
  data: {
    label: string;
    struct: StructType;
    operator?: 'X' | 'F' | 'G' | 'U';
  };
  selected: boolean;
  id: string;
}

const OperatorNode = memo(({ data, selected, id }: OperatorNodeProps) => {
  const { operator = 'X' } = data;
  const { openDetails } = useNodeDetails();
  return (
    <div onDoubleClick={() => openDetails(id, 'operator')}>
      <NodeResizer color="#4A90E2" isVisible={selected} minWidth={40} minHeight={40} />
      <Handle type="target" position={Position.Left} />
      <div style={{
        border: '2px solid #4A90E2',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff'
      }}>
        {operatorSymbols[operator]}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

OperatorNode.displayName = "OperatorNode";
export default OperatorNode;