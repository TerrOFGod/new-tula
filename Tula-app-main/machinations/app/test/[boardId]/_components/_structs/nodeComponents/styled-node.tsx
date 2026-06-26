"use client";
import {
  ArrowLeftRight,
  Recycle,
  Dices,
  Hourglass,
  Play,
  CheckCheck,
  LucideIcon,
  Minus,
  Webhook
} from "lucide-react";
import "./nodeStyle.css";
import { StructType } from "@/app/types/structs";
import { Handle, Position, useNodeId } from "reactflow";
import { useState } from "react";
import useStore from "@/app/store/store";
import { SimulationNodeStats, useSimulationNodeHighlight } from "@/app/test/[boardId]/_components/simulation/SimulationNodeStats";
import { cn } from "@/utils/canvas";

interface ITestNodeProps {
  struct: StructType;
  label: string;
  name?: string;
  info?: string;
}

type StructStyles = {
  [key in StructType]: string;
};

interface StructIcons {
  [key: string]: LucideIcon;
}

const styleNode: StructStyles = {
  Consumer: "consumerNode",
  Converter: "converterNode",
  Delay: "delayNode",
  End: "endNode",
  Gate: "gateNode",
  Pool: "poolNode",
  Random: "randomNode",
  Source: "sourceNode",
  Entity: "entityNode",
  State: "stateNode",
  Event: "eventNode",
  Rule: "ruleNode",
  Operator: "operatorNode",
  Trigger: "triggerNode"
};

const styleNodeIcon: any = {
  Source: <Play />,
  Converter: <Recycle />,
  Consumer: <Minus />,
  Delay: <Hourglass />,
  Gate: <ArrowLeftRight />,
  Random: <Dices />,
  End: <CheckCheck />,
  Trigger: <Webhook />,
};

export const StyledNode = ({ struct, label, name, info }: ITestNodeProps) => {
  const { setNodeName } = useStore();
  const nodeId = useNodeId();
  const isHighlighted = useSimulationNodeHighlight(nodeId!);

  const [value, setValue] = useState(name);
  const onChange = (event: any) => {
    setValue(event.target.value);
    setNodeName(nodeId!, event.target.value);
  };

  return (
    <div
      className={cn(
        "simulation-node-wrapper",
        isHighlighted && "simulation-node-highlight"
      )}
    >
      <SimulationNodeStats nodeId={nodeId!} />
      <div>
      {struct !== StructType.Source && (
        <Handle type={"target"} position={Position.Left} />
      )}
      <div className={styleNode[struct]}>
        <div className="node-icon-label">{struct in styleNodeIcon ? styleNodeIcon[struct] : label}</div>
        {info && ( <div className="node-info"> {info} </div> )}
        {/* {label} */}
      </div>
      {struct !== StructType.End && (
        <Handle type="source" position={Position.Right} />
      )}
      <div className="h-full w-full flex justify-center">
        <input
          className="bg-transparent w-[50px] border-none text-xs font-bold text-center"
          value={value}
          onChange={onChange}
        />
      </div>
      </div>
    </div>
  );
};
