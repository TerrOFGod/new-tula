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

const ConverterNode = ({
  data: { label, struct, name },
  selected,
}: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (isPlay) {


      let newEdges: Edge[] = edges.filter((edge) => edge.target === nodeId)
      let nodeIds: string[] = newEdges.map((edge) => edge.source);

      if (nodeIds.length > 0) {
        nodeIds.forEach(nodeId => {
            let foundNode = nodes.find(node => node.id === nodeId);
            let edge = edges.find(edge => edge.source === foundNode?.id)
            if (foundNode) {
                if (+foundNode.data?.label > edge?.data) {
                    setNodeLabel(foundNode.id, foundNode.data?.label - edge?.data);
                }
            }
        });
    }

      const sumOfData = newEdges.reduce((accumulator, currentEdge) => {
        return accumulator + (+currentEdge.data || 0); 
      }, 0);
      intervalId = setInterval(() => {


        setNodeLabel(nodeId!, (parseInt(label) + sumOfData));
      }, time * 1000);
    }

    return () => clearInterval(intervalId!);

  }, [isPlay, onStop, onReset, label]);

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

export default memo(ConverterNode);
