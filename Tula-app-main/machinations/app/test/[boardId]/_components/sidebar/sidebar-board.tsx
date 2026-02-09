import Link from "next/link";
import React from "react";
import { BoardTitle } from "../BoardInfoModal/BoardTitle";

interface TestIdPageProps {
  params: {
    boardId: string;
  };
}
const BoardSidebar = ({ params }: TestIdPageProps) => {
  return (
    <aside
      id="sidebar"
      className="bg-black text-white w-[150px] pt-10 pl-5 absolute inset-y-0 left-0 
                transform md:relative md:translate-x-0 md:flex
                 md:flex-col gap-y-6"
      data-dev-hint="sidebar">
         <BoardTitle boardId={params.boardId} />
          <Link href="/editor">
            <span>Editor</span>
          </Link>
          {/* <Link href="/lineage">
            <span>Lineage</span>
          </Link>
          <Link href="/tests">
            <span>Tests</span>
          </Link>
          <Link href="/tables">
            <span>Tables</span>
          </Link>
          <Link href="/macros">
            <span>Macros</span>
          </Link> */}
    </aside>
  );
};

export default BoardSidebar;
