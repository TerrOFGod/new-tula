import { StructType } from "@/app/types/structs";
import { ToolButton } from "../ui/ToolButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeftRight,
  Recycle,
  Play,
  Dices,
  Hourglass,
  Webhook,
  CheckCheck,
  Undo,
  Redo,
  BadgePlus,
  BadgeMinus,
  Eraser,
  Box, Layers, Zap, Scale, Sigma, Link2, Percent, GitMerge,
  ChevronDown,
  ChevronRight,
  CircleDot
} from "lucide-react";
import useStore, { RFState } from "@/app/store/store";
import { shallow } from "zustand/shallow";
import { useState } from "react";

interface ToolbarProps {
  canvasState: CanvasState;
  onClick: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addNode: state.addNode,
});

export const Toolbar = () => {
  const { addNode } = useStore(selector, shallow);
  const { deleteAll } = useStore();
  const { edgeType, setEdgeType } = useStore();

  const [isTulaOpen, setIsTulaOpen] = useState(true);
  const [isSpecOpen, setIsSpecOpen] = useState(true);

  return (
    <div className="absolute top-40 left-2 flex flex-col gap-y-4">
      {/* Раздел TULA */}
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        <button
          onClick={() => setIsTulaOpen(!isTulaOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span>TULA</span>
          {isTulaOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {isTulaOpen && (
          <div className="p-3 pt-0 grid grid-cols-3 gap-1 animate-in slide-in-from-top-1 duration-200">
            <ToolButton label="Source" onClick={() => addNode(StructType.Source)} isActive={false} icon={Play} />
            <ToolButton label="Pool" onClick={() => addNode(StructType.Pool)} isActive={false} icon={BadgePlus} />
            <ToolButton label="Consumer" onClick={() => addNode(StructType.Consumer)} isActive={false} icon={BadgeMinus} />
            <ToolButton label="Converter" onClick={() => addNode(StructType.Converter)} isActive={true} icon={Recycle} />
            <ToolButton label="Gate" onClick={() => addNode(StructType.Gate)} isActive={false} icon={ArrowLeftRight} />
            <ToolButton label="Random" onClick={() => addNode(StructType.Random)} isActive={false} icon={Dices} />
            <ToolButton label="Delay" onClick={() => addNode(StructType.Delay)} isActive={false} icon={Hourglass} />
            <ToolButton label="Trigger" onClick={() => addNode(StructType.Trigger)} isActive={false} icon={Webhook} />
            <ToolButton label="End" onClick={() => addNode(StructType.End)} isActive={false} icon={CheckCheck} />
          </div>
        )}
      </div>

      {/* Раздел SPEC */}
      <div className="bg-white rounded-md shadow-md overflow-hidden transition-all duration-200">
        <button
          onClick={() => setIsSpecOpen(!isSpecOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span>SPEC</span>
          {isSpecOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {isSpecOpen && (
          <div className="p-3 pt-0 grid grid-cols-3 gap-1 animate-in slide-in-from-top-1 duration-200">
            <ToolButton label="Entity" onClick={() => addNode(StructType.Entity)} icon={Box} />
            <ToolButton label="State" onClick={() => addNode(StructType.State)} icon={Layers} />
            <ToolButton label="Event" onClick={() => addNode(StructType.Event)} icon={Zap} />
            <ToolButton label="Rule" onClick={() => addNode(StructType.Rule)} icon={Scale} />
            <ToolButton label="Operator" onClick={() => addNode(StructType.Operator)} icon={Sigma} />
          </div>
        )}
      </div>

      {/* Раздел GENERAL (всегда открыт) */}
      <div className="bg-white rounded-md p-3 shadow-md">
        <div className="text-xs font-semibold text-gray-500 mb-2 tracking-wider text-center">
          GENERAL
        </div>
        <ToolButton
          label="Empty (waypoint)"
          onClick={() => addNode(StructType.Empty)}
          isActive={false}
          icon={CircleDot}
        />

        <label>Edge type:</label>
        <Select value={edgeType} onValueChange={(value: any) => setEdgeType(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Edge type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">Resource</SelectItem>
            <SelectItem value="probabilistic">Probabilistic</SelectItem>
            <SelectItem value="conditional">Conditional</SelectItem>
            <SelectItem value="trigger">Trigger</SelectItem>
            <SelectItem value="modifier">Modifier</SelectItem>
          </SelectContent>
        </Select>

        <div className="grid grid-cols-3 gap-1 mt-1">
          <ToolButton label="Undo" onClick={() => {}} isActive={false} icon={Undo} />
          <ToolButton label="Redo" onClick={() => {}} isActive={false} icon={Redo} />
          <ToolButton label="Eraser" onClick={deleteAll} isActive={false} icon={Eraser} />
        </div>
      </div>
    </div>
  );
};
