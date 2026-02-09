"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import { Edge, NodeResizer, useEdges, useNodeId, useNodes } from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const SourceNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges();
  const nodes = useNodes();

  useEffect(() => {
    let intervalIds: NodeJS.Timeout[] = [];

    if (isPlay && nodeId) {
      let targetEdges: Edge[] = edges.filter((edge) => edge?.source === nodeId);
      targetEdges.forEach((edge) => {
        const targetNode = nodes.find((node) => node.id === edge.target);
        if (!targetNode) return;

        let initialData = 0;

        const intervalId = setInterval(() => {
          initialData += +edge.data;
          setNodeLabel(targetNode?.id!, +initialData);
        }, time * 1000);

        intervalIds.push(intervalId);
      });
    }
    return () => {
      intervalIds.forEach((intervalId) => clearInterval(intervalId));
    };
  }, [isPlay, onStop, onReset, edges, nodeId, nodes, time, setNodeLabel]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(SourceNode);
