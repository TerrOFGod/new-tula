"use client";
import { memo } from "react";
import { NodeResizer } from "reactflow";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType; // Предполагается добавление 'Entity' в Enum
    name?: string;
    properties?: string[];
  };
  selected: boolean;
}

const EntityNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  return (
    <>
      <NodeResizer color="#4A90E2" isVisible={selected} minWidth={60} minHeight={60} />
      {/* Стилизация через StyledNode с иконкой Box или Database */}
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(EntityNode);