import { useCallback, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useStore from "@/app/store/store";

import { filterPatches, generatePatches } from "@/utils/jsonDiff";
import { toConvexEdge, toConvexNode } from "@/utils/adapters";
import { BoardSavingStatus } from "../types/history";

export const useVersionsHistory = (boardId: string) => {
  const {
    liveblocks: { isStorageLoading },
    nodes,
    edges,
    previousState,
    setPreviousState,
    savingStatus,
    setSavingStatus,
  } = useStore();
  const createVersion = useMutation(api.boardsHistory.createVersion);

  const patchCounterRef = useRef(0);
  const retryCountRef = useRef(0);

  // Ручное сохранение снапшота
  const manualSave = useCallback(
    async (
      isRestore?: boolean,
      restoredVersionTime?: number,
      restoredVersionMessage?: string
    ) => {
      if (isStorageLoading) {
        toast.error("Дождитесь загрузки хранилища");
        return;
      }

      if (savingStatus === BoardSavingStatus.SAVING) {
        return;
      }

      try {
        setSavingStatus(BoardSavingStatus.SAVING);

        const { version, createdAt } = await createVersion({
          boardId: boardId as Id<"boards">,
          type: "snapshot",
          data: {
            nodes: nodes.map(toConvexNode),
            edges: edges.map(toConvexEdge),
          },
          message:
            isRestore && restoredVersionMessage
              ? `${restoredVersionMessage} (Востанновленная)`
              : undefined,
          restoreByTime:
            isRestore && restoredVersionTime ? restoredVersionTime : undefined,
        });

        setPreviousState({
          nodes,
          edges,
          version,
          createdAt,
        });

        patchCounterRef.current = 0;
      } catch (error) {
        console.error("Ошибка сохранения версии:", error);
        toast.error("Ошибка при сохранении версии");
      } finally {
        setSavingStatus(BoardSavingStatus.IDLE);
      }
    },
    [
      boardId,
      createVersion,
      edges,
      isStorageLoading,
      nodes,
      savingStatus,
      setPreviousState,
      setSavingStatus,
    ]
  );

  // Автосохранение с дебаунсом в 1 минуту
  const savePatch = async () => {
    try {
      if (!previousState) return;

      const patches = filterPatches(
        generatePatches(
          { nodes: previousState.nodes, edges: previousState.edges },
          { nodes, edges }
        )
      );

      if (patches.length === 0) return;

      setSavingStatus(BoardSavingStatus.SAVING);

      const { version, createdAt } = await createVersion({
        boardId: boardId as Id<"boards">,
        type: "patch",
        data: {
          patches,
          base: previousState.version,
        },
      });

      patchCounterRef.current++;
      retryCountRef.current = 0;

      setPreviousState({
        nodes,
        edges,
        version,
        createdAt,
      });

      // Создаем снапшот каждые 25 патчей или раз в 15 минут
      if (patchCounterRef.current >= 25) {
        await manualSave();
      }
    } catch (error) {
      if (retryCountRef.current < 3) {
        retryCountRef.current++;
        setTimeout(savePatch, 5000 * retryCountRef.current);
        return;
      }
      console.error("Ошибка сохранения патча:", error);
      toast.error("Ошибка при автосохранении версии");
    } finally {
      setSavingStatus(BoardSavingStatus.IDLE);
    }
  };

  // Автосохранение каждые 60 секунд
  const autoSave = useDebouncedCallback(savePatch, 60000, {
    leading: false,
    trailing: true,
    maxWait: 60000, // Максимальное время ожидания
  });

  return { autoSave, manualSave };
};
