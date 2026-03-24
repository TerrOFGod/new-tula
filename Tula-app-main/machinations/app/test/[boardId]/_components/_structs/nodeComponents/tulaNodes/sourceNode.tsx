"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import { Edge, NodeResizer, useEdges, useNodeId, useNodes } from '@xyflow/react';
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "../styled-node";
import { useNodeDetails } from "@/app/store/use-node-details";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
    
    //general
    generationRate?: number;
    distributionType?: any;

    //normal
    mean?: number;
    stddev?: number;

    //exponential
    rate?: number;

    //deterministic
    triggerEvent?: string;
    
    //temporal
    interval?: number;
    startTurn?: number;
  };
  selected: boolean;
  id: string;
}

const SourceNode = ({ id, data, selected }: DataProps) => {
  const { 
    struct, 
    label, 
    name, 
    //general
    generationRate, 
    distributionType,
    //normal
    mean,
    stddev,
    //exponential
    rate,
    //deterministic
    triggerEvent, 
    //temporal
    startTurn,
    interval } = data;
  let inf = "";
  switch (distributionType){
    case "deterministic":
      inf = triggerEvent ? `trigger: ${triggerEvent}` : '';
      break;
    case "normal":
      inf = generationRate ? `gen: ${generationRate}/sec` : '';
      break;
    case "exponential":
      inf = generationRate ? `gen: ${generationRate} per ${rate} sec(s)` : '';
      break;
    case "temporal":
      let startOn = startTurn ? `starts on turn: ${startTurn} \n` : '';
      inf = generationRate ? `${startOn}gen: ${generationRate} per ${interval} turn(s)` : '';
      break;
  }
  const info = inf;

  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const { openDetails } = useNodeDetails();
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
          initialData += +edge.data?.value!;
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
      <div onDoubleClick={() => openDetails(id, 'source')}>
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

export default memo(SourceNode);
