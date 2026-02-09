import { FC, useCallback, useState } from "react";
import { useConvex, useMutation } from "convex/react";
import { toast } from "sonner";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/app/hooks/use-api-mutation";
import { Button } from "@/components/ui/button";
import { useRestoreVersionHandler } from "@/app/hooks/useRestoreVersionHandler";
import { EditableText } from "../../ui";
import styles from "./HistoryItem.module.scss";
import useStore from "@/app/store/store";

type THistoryItemProps = {
  boardId: string;
  version: Doc<"boardsHistory">;
  isSelected: boolean;
  onClick: (versionId: Id<"boardsHistory">) => void;
  onSaveRestoredVersion: (
    isRestore?: boolean,
    restoredVersionTime?: number,
    restoredVersionMessage?: string
  ) => void;
};

export const HistoryItem: FC<THistoryItemProps> = ({
  boardId,
  version,
  isSelected: isCurrent,
  onClick,
  onSaveRestoredVersion,
}) => {
  const convex = useConvex();
  const { onDeleteVersion, setPreviousState } = useStore();

  const { mutate: updateVersionMessage, pending: isVersionMessageUpdating } =
    useApiMutation(api.boardsHistory.updateVersionMessage);
  const { handleRestore } = useRestoreVersionHandler({
    boardId: boardId as Id<"boards">,
    onSaveRestoredVersion,
  });
  const deleteVersion = useMutation(api.boardsHistory.deleteVersion);

  const [isHovered, setIsHovered] = useState(false);

  const handleUpdateHistoryItemMessage = useCallback(
    async (versionId: Id<"boardsHistory">, message: string) => {
      await updateVersionMessage({ id: versionId, message })
        .then(() => {
          toast.success(`Версия успешно переименована`);
        })
        .catch(() => toast.error("Ошибка при переименовании версии"));
    },
    []
  );

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isCurrent) {
        onClick(version._id);
      }

      await deleteVersion({ versionId: version._id });

      const reinitState = await convex.query(api.board.loadBoardState, {
        boardId: boardId as Id<"boards">,
      });

      await onDeleteVersion(reinitState);
      await setPreviousState({
        nodes: reinitState.nodes,
        edges: reinitState.edges,
        version: reinitState.version,
        createdAt: reinitState._creationTime,
      });

      toast.success("Version deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div
      className={`${styles.versionItem} ${isCurrent ? styles.selected : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(version._id)}
    >
      <div className={styles.versionItemMeta}>
        <span className="version-type">
          {version.type === "snapshot" ? "Snapshot" : "Patch"}
        </span>
        <span className={styles.versionItemMetaTime}>
          {new Date(version._creationTime).toLocaleDateString()}
        </span>
      </div>

      <div className={styles.versionItemContent}>
        <div className={styles.versionItemHeader}>
          <EditableText
            initialValue={
              version.message ||
              new Date(version._creationTime).toLocaleTimeString()
            }
            onBlur={(message: string) => {
              handleUpdateHistoryItemMessage(version._id, message);
            }}
          />
        </div>
        <div className={styles.versionItemContentColabarator}>
          <div className={styles.swatch} />
          <span>{version.authorName || version.authorId}</span>
        </div>
        {version.restoreByTime && (
          <div
            className={styles.versionItemContentMessage}
          >{`Востановлена версия от ${new Date(version.restoreByTime).toLocaleTimeString()}`}</div>
        )}
      </div>

      {isHovered && (
        <div className={styles.versionItemActions}>
          {isCurrent && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleRestore(version.version)}
            >
              Восстановить
            </Button>
          )}
          {version.version !== 0 && (
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Удалить
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
