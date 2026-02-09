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
} from "lucide-react";
import "./nodeStyle.css";
import { StructType } from "@/app/types/structs";
import { Handle, Position, useNodeId } from "reactflow";
import { useState } from "react";
import useStore from "@/app/store/store";

interface ITestNodeProps {
  struct: StructType;
  label: string;
  name?: string;
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
};

const styleNodeIcon: any = {
  Source: <Play />,
  Converter: <Recycle />,
  Consumer: <Minus />,
  Delay: <Hourglass />,
  Gate: <ArrowLeftRight />,
  Random: <Dices />,
  End: <CheckCheck />,
};

export const StyledNode = ({ struct, label, name }: ITestNodeProps) => {
  const { setNodeName } = useStore();
  const nodeId = useNodeId();

  const [value, setValue] = useState(name);
  const onChange = (event: any) => {
    setValue(event.target.value);
    setNodeName(nodeId!, event.target.value);
  };

  return (
    <div>
      {struct !== StructType.Source && (
        <Handle type={"target"} position={Position.Left} />
      )}
      <div className={styleNode[struct]}>
        {struct in styleNodeIcon ? styleNodeIcon[struct] : label}
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
  );
};
