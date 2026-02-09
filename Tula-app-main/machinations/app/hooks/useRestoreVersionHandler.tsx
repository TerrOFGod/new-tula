import { useCallback } from "react";
import { useConvex } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useStore from "../store/store";

type TUseRestoreVersionHandlerProps = {
  boardId: Id<"boards">;
  onSaveRestoredVersion: (
    isRestore?: boolean,
    restoredVersionTime?: number,
    restoredVersionMessage?: string
  ) => void;
};

export const useRestoreVersionHandler = ({
  boardId,
  onSaveRestoredVersion,
}: TUseRestoreVersionHandlerProps) => {
  const convex = useConvex();
  const { onRestoreVersion } = useStore();

  const handleRestore = useCallback(
    async (versionId: number) => {
      const boardVersion = await convex
        .query(api.boardsHistory.getVersionByNumber, {
          boardId: boardId,
          version: versionId,
        })
        .catch((error) => {
          console.error("Ошибка при получении id версии по номеру:", error);
        });

      try {
        const restoredVersion = await convex.query(
          api.boardsHistory.restoreVersion,
          {
            versionId: boardVersion?._id as Id<"boardsHistory">,
          }
        );

        await onRestoreVersion(restoredVersion);
        await onSaveRestoredVersion(
          true,
          boardVersion?._creationTime,
          boardVersion?.message
        );
      } catch (error) {
        toast.error("Ошибка при восстановлении версии в истории");
      }
    },
    [boardId]
  );

  return { handleRestore };
};
