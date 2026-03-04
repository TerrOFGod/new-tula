"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import { Edge, NodeResizer, useEdges, useNodeId, useNodes } from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "../styled-node";
import { useNodeDetails } from "@/app/store/use-node-details";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
    conversionIn?: number;
    conversionOut?: number;
    converterProbEffects?: any[];
  };
  selected: boolean;
  id: string;
}

const ConverterNode = ({ id, data, selected, }: DataProps) => {
  const { struct, label, name, conversionIn, conversionOut, converterProbEffects } = data;
  const hasProb = converterProbEffects && converterProbEffects.length > 0;
  const ratio = `${conversionIn}->${conversionOut}`;
  const probRatio = hasProb ? `p=${converterProbEffects[0].probability}:${converterProbEffects[0].conversionIn}->${converterProbEffects[0].conversionOut}` : '';
  const info = hasProb ? probRatio : ratio;

  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const { openDetails } = useNodeDetails();
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
      <div onDoubleClick={() => openDetails(id, 'converter')}>
        <NodeResizer color="blue" isVisible={selected} minWidth={45} minHeight={45} />
        <StyledNode struct={struct} label={label} name={name} info={info} />
      </div>
    </>
  );
};

export default memo(ConverterNode);
