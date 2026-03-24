// app/test/[boardId]/_components/_structs/nodeComponents/emptyNode.tsx
"use client";
import { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

interface EmptyNodeProps {
  data: {
    label?: string;
  };
  selected: boolean;
}

const EmptyNode = memo(({ data, selected }: EmptyNodeProps) => {
  return (
    <>
      <NodeResizer
        color="#4A90E2"
        isVisible={selected}
        minWidth={10}
        minHeight={10}
      />
      {/* Левый хендл – для входящих рёбер */}
      <Handle type="target" position={Position.Left} id="left" />
      {/* Правый хендл – для исходящих рёбер */}
      <Handle type="source" position={Position.Right} id="right" />

      {/* Минимальная визуальная точка */}
      <div
        style={{
          width: 8,
          height: 8,
          backgroundColor: '#888',
          borderRadius: '50%',
          opacity: 0.5,
          cursor: 'grab',
        }}
        title="Пустая точка для управления рёбрами"
      />
    </>
  );
});

EmptyNode.displayName = 'EmptyNode';
export default EmptyNode;