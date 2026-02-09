"use client";

import { useCallback, useState } from "react";
import { useQuery } from "convex/react";

import { useRenameModal } from "@/app/store/use-rename-modal";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/app/hooks/use-api-mutation";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import useStore from "@/app/store/store";
import { Participants } from "@/app/board/[boardId]/_components/participants";
import { EdgeTypePanel } from "../panels/EdgeTypePanel";
import { BoardTitle } from "./BoardTitle";

import styles from "./BoardInfoModal.module.scss";

interface IBoardInfoModalProps {
  boardId: string;
  handleSaveVersion: () => void;
}

const BoardInfoModal = ({
  boardId,
  handleSaveVersion,
}: IBoardInfoModalProps) => {
  // const [description, setDescription] = useState("Тестовая доска для показа");
  const boardData = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  });
  const { title, description, edgesType } = useStore.getState();

  const { mutate: updateMetaInfo, pending: updateMetaInfoPending } =
    useApiMutation(api.board.updateMetaInfo);

  const { currentEdgesType } = useChangeEdgeType();
  // const [boardTitle, setBoardTitle] = useState(boardData?.title);
  const [boardDescription, setBoardDescription] = useState(description || "");

  const { setIsVisisbleBoard } = useRenameModal();

  const handleDescriptionChange = (event: any) => {
    setBoardDescription(event.target.value);
  };

  const handleSave = useCallback(async () => {
    useStore.setState({
      // title: boardData?.title,
      description: boardDescription,
      edgesType: currentEdgesType,
    });

    await updateMetaInfo({
      id: boardData?._id,
      title: boardData?.title,
      description: boardDescription,
      edgesType: currentEdgesType,
    })
      .then(() => {
        handleSaveVersion();
      })
      .catch((e) => {
        console.log(e);
      });
  }, [
    boardData?._id,
    boardData?.title,
    boardDescription,
    currentEdgesType,
    handleSaveVersion,
    updateMetaInfo,
  ]);

  return (
    <div className={styles.board}>
      <div className={styles.content}>
        <div className={styles.content__items}>
          <div className={styles.header}>
            <BoardTitle boardId={boardId} />
            <button className={styles.closeButton} onClick={setIsVisisbleBoard}>
              &#x2716;
            </button>
          </div>

          <div>
            <h1>
              <strong>Owner:</strong> {boardData?.authorName}
            </h1>
            <h1>
              <strong>Participants:</strong>
            </h1>
            <Participants />
          </div>
          <div className={styles.description}>
            <h1>
              <strong>Description:</strong>
            </h1>
            <textarea
              value={boardDescription}
              onChange={handleDescriptionChange}
              className={styles.description}
            />
            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={updateMetaInfoPending}
            >
              Save
            </button>
          </div>
          <div>
            <h1>
              <strong>Connection type:</strong>
            </h1>
            <EdgeTypePanel />
          </div>

          <div className={styles.date_info}>
            <h2>
              <strong>Created: </strong>27.10.2024{" "}
            </h2>
            <h2>
              <strong>Updated: </strong>27.10.2024{" "}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardInfoModal;
