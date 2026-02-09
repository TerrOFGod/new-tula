"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import { NodeResizer, useEdges, useNodeId } from "reactflow";
import useStore from "@/app/store/store";
import { StyledNode } from "./nodeComponents/styled-node";
import { StructType } from "@/app/types/structs";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const CustomNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, time, onReset, isReset } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();

  useEffect(() => {
    let newEdges = edges.filter((edge) => edge.target === nodeId);

    let { sourceStruct, sourceValue, targetValue } = getEdgeValues(
      newEdges[0]?.id
    );
  
    const sumOfData = newEdges.reduce((accumulator, currentEdge) => {
      return accumulator + (+currentEdge.data! || 0);
    }, 0);

    let intervalId: any;
    const intervalCallback = () => {
      setNodeLabel(nodeId!, parseInt(label) + sumOfData);
    };

    if (isPlay) {
      intervalId = setInterval(intervalCallback, time * 1000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [label, nodeId, isPlay, onReset, setNodeLabel, edges]);

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

export default memo(CustomNode);
