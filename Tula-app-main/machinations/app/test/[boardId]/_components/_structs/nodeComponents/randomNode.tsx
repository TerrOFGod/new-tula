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
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const RandomNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();



  useEffect(() => {
    let intervalId = null;
    if (isPlay) {
      const initialValue = label || null
      let newEdges: Edge[] = edges.filter((edge) => edge.source === nodeId)
      let nodeIds: string[] = newEdges.map(edge => edge.target)      //идишники нод
      
    //   intervalId = setInterval(() => {

    //     setNodeLabel(nodeId, (parseInt(label) + sumOfData).toString());
    //   }, time * 1000);

    
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

export default memo(RandomNode);
