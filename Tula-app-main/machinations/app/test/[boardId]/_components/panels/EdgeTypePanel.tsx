import React from "react";

import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import { EdgesTypes } from "@/app/types/structs";
import useStore from "@/app/store/store";

export const EdgeTypePanel = () => {
  const { onChangeEdgesType } = useChangeEdgeType();
  const { edgesType: currentEdgesTypeValue } = useStore.getState();

  const handleChangeEdgesType = (type: EdgesTypes) => {
    onChangeEdgesType(type);
    useStore.setState({
      edgesType: type,
    });
  };

  return (
    <div className="flex gap-x-2 items-center">
      <button
        className={`bg-blue-100 rounded-md p-2 ${
          currentEdgesTypeValue === EdgesTypes.DEFAULT
            ? "bg-blue-500 text-white"
            : ""
        }`}
        onClick={() => handleChangeEdgesType(EdgesTypes.DEFAULT)}
      >
        Default
      </button>
      <button
        className={`bg-blue-100 rounded-md p-2 ${
          currentEdgesTypeValue === EdgesTypes.SMOOTH_STEP
            ? "bg-blue-500 text-white"
            : ""
        }`}
        onClick={() => handleChangeEdgesType(EdgesTypes.SMOOTH_STEP)}
      >
        SmoothStep
      </button>
      <button
        className={`bg-blue-100 rounded-md mr-16 p-2 ${
          currentEdgesTypeValue === EdgesTypes.BEZIER
            ? "bg-blue-500 text-white"
            : ""
        }`}
        onClick={() => handleChangeEdgesType(EdgesTypes.BEZIER)}
      >
        Bezier
      </button>
    </div>
  );
};
