"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { Poppins } from "next/font/google";

import { cn } from "@/utils/canvas";
import { Hint } from "@/components/hint";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useRenameModal } from "@/app/store/use-rename-modal";
import styles from "./BoardInfoModal.module.scss";

interface InfoProps {
  boardId: string;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const TabSeparator = () => {
  return <div className="text-neutral-300 px-1.5">|</div>;
};

export const BoardTitle = ({ boardId }: InfoProps) => {
  const { onOpen } = useRenameModal();

  const data = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  });

  // if (!data) return <div>No info</div>;

  return (
    <div>
      <Hint label="Edit title" side="bottom" sideOffset={10}>
        <Button
          className={styles.hint_btn}
          onClick={() => onOpen(data?._id as string, data?.title || "")}
        >
          <h2>{data?.title}</h2>
        </Button>
      </Hint>
    </div>
  );
};
