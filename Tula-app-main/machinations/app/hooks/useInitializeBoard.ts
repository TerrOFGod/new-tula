import { useEffect } from "react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toReactFlowNode, toReactFlowEdge } from "@/utils/adapters";

import useStore from "../store/store";
import { useChangeEdgeType } from "../store/use-custom-edge";
import { EdgesTypes } from "../types/structs";

export const useInitializeBoard = (boardId: Id<"boards">) => {
  const boardState = useQuery(api.board.loadBoardState, { boardId });
  const { initialize } = useStore();
  const { onChangeEdgesType } = useChangeEdgeType();

  useEffect(() => {
    if (boardState && !useStore.getState().isInitialized) {
      const nodes = boardState.nodes.map(toReactFlowNode);
      const edges = boardState.edges.map(toReactFlowEdge);

      initialize({
        nodes,
        edges,
        title: boardState.title,
        description: boardState?.description || "",
        edgesType: (boardState?.edgesType as EdgesTypes) || EdgesTypes.DEFAULT,
        version: boardState.version,
        createdAt: boardState._creationTime,
      });
      onChangeEdgesType(
        (boardState?.edgesType as EdgesTypes) || EdgesTypes.DEFAULT
      );
    }
  }, [boardState]);
};
