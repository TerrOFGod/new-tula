import { Panel, useEdges, useNodes } from "reactflow";
import { ToolButton } from "../ui/ToolButton";
import { Play, RotateCcw, Pause } from "lucide-react";
import CustomInput from "../ui/CustomInput";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import useStore from "@/app/store/store";
import { useEffect } from "react";
import { Iterations } from "../iterations";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import { Games } from "../games";

export const BottomPanel = () => {
  const { isPlay, onPlay, onStop, onReset, time, iterations, games } = useAnimateScheme();
  const { setEdgeAnimated } = useStore();
  useEffect(() => {
    setEdgeAnimated(isPlay);
  }, [isPlay]);

  const edges = useEdges();
  const nodes = useNodes();
  const { error, setError } = useChangeEdgeType();

  return (
    <Panel position="bottom-center">
      <div className="bg-white rounded-md flex gap-x-2 items-center shadow-md py-2 px-2">
        <div className="mr-2 flex gap-x-2 items-center">
          <CustomInput label="Iterations" initialValue={iterations} />
          <CustomInput label="Time(s)" initialValue={time} />
          <CustomInput label="Games" initialValue={games} />
        </div>
        <ToolButton
          label="Play"
          isDisabled={error ? true : isPlay}
          onClick={onPlay}
          isActive={false}
          icon={Play}
          background="blue"
        />
        <ToolButton
          label="Pause"
          isDisabled={!isPlay}
          onClick={onStop}
          isActive={false}
          icon={Pause}
          background="red"
        />
        <ToolButton
          label="Reset"
          onClick={onReset}
          isActive={false}
          icon={RotateCcw}
          background="red"
        />
        <Iterations />
        <Games />
        <div className="text-xs text-center px-1">
          <label>Total count</label>
          <div>{edges.length + nodes.length}</div>
        </div>
      </div>
    </Panel>
  );
};
