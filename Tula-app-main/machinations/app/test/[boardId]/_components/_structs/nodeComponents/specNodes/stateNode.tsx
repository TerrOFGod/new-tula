"use client";
import { memo } from "react";
import { Handle, Position, NodeResizer } from "reactflow";
import { StructType } from "@/app/types/structs";
import { useNodeDetails } from "@/app/store/use-node-details";
import { SimulationNodeStats, useSimulationNodeHighlight } from "@/app/test/[boardId]/_components/simulation/SimulationNodeStats";
import { cn } from "@/utils/canvas";

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
  id: string;
}

const StateNode = memo(({ data, selected, id }: StateNodeProps) => {
  const { name, label, valueType, range, enumValues } = data;
  const { openDetails } = useNodeDetails();
  const isHighlighted = useSimulationNodeHighlight(id);
  return (
    <div
      className={cn(
        "simulation-node-wrapper",
        isHighlighted && "simulation-node-highlight"
      )}
      onDoubleClick={() => openDetails(id, 'state')}
    >
      <SimulationNodeStats nodeId={id} />
      <NodeResizer color="#4A90E2" isVisible={selected} minWidth={80} minHeight={50} />
      <Handle type="target" position={Position.Left} />
      <div style={{
        border: '2px solid #4A90E2',
        borderRadius: '4px',
        padding: '5px',
        background: '#fff',
        boxShadow: isHighlighted ? '0 0 0 3px rgba(109, 40, 217, 0.25)' : undefined,
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