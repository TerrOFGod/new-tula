"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "../styled-node";
import { useNodeDetails } from "@/app/store/use-node-details";

interface DataProps {
  id: string;
  data: {
    label: string;
    struct: StructType;
    name?: string | undefined;
    resourceType?: string;
    min?: number;
    max?: number;
  };
  selected: boolean;
}

const PoolNode = ({ data, selected, id, }: DataProps) => {
  const { struct, label, name, resourceType, min, max } = data;
  const info = resourceType ? `${resourceType}: ${label} [${min},${max}]` : `${label} [${min},${max}]`;

  const { isPlay, onStop, onReset, time, gamesCount, resetNodes } =
    useAnimateScheme();

  const { openDetails } = useNodeDetails();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (isPlay) {
      let newEdges = edges.filter((edge) => edge.target === nodeId);
      const sumOfData = newEdges.reduce((accumulator, currentEdge) => {
        return accumulator + (+currentEdge.data || 0);
      }, 0);
      intervalId = setInterval(() => {
        setNodeLabel(nodeId!, parseInt(label) + sumOfData);
      }, time * 1000);
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset, label, gamesCount]);

  return (
    <>
      <div onDoubleClick={() => openDetails(id, 'pool')}>
        <NodeResizer
          color="blue"
          isVisible={selected}
          minWidth={45}
          minHeight={45}
        />

        <StyledNode struct={struct} label={label} name={name} info={info} />
      </div>

    </>
  );
};

export default memo(PoolNode);
