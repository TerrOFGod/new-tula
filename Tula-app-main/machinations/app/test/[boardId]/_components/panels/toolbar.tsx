import { StructType } from "@/app/types/structs";
import { ToolButton } from "../ui/ToolButton";
import {
  ArrowLeftRight,
  Recycle,
  Play,
  Dices,
  Hourglass,
  CheckCheck,
  Undo,
  Redo,
  BadgePlus,
  BadgeMinus,
  Eraser,
} from "lucide-react";
import useStore, { RFState } from "@/app/store/store";
import { shallow } from "zustand/shallow";

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

  return (
    <div className="absolute top-40 left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        <ToolButton
          label="Source"
          onClick={() => addNode(StructType.Source)}
          isActive={false}
          icon={Play}
        />
        <ToolButton
          label="Pool"
          onClick={() => addNode(StructType.Pool)}
          isActive={false}
          icon={BadgePlus}
        />
        <ToolButton
          label="Consumer"
          onClick={() => addNode(StructType.Consumer)}
          isActive={false}
          icon={BadgeMinus}
        />
        <ToolButton
          label="Converter"
          onClick={() => addNode(StructType.Converter)}
          isActive={true}
          icon={Recycle}
        />
        <ToolButton
          label="Gate"
          onClick={() => addNode(StructType.Gate)}
          isActive={false}
          icon={ArrowLeftRight}
        />
        <ToolButton
          label="Random"
          onClick={() => addNode(StructType.Random)}
          isActive={false}
          icon={Dices}
        />
        <ToolButton
          label="Delay"
          onClick={() => addNode(StructType.Delay)}
          isActive={false}
          icon={Hourglass}
        />
        <ToolButton
          label="End"
          onClick={() => addNode(StructType.End)}
          isActive={false}
          icon={CheckCheck}
        />
      </div>
      {/* undo redo */}
      <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
        <ToolButton
          label="Undo"
          onClick={() => {}}
          isActive={false}
          icon={Undo}
        />
        <ToolButton
          label="Redo"
          onClick={() => {}}
          isActive={false}
          icon={Redo}
        />
        <ToolButton
          label="Eraser"
          onClick={deleteAll}
          isActive={false}
          icon={Eraser}
        />
      </div>
    </div>
  );
};
