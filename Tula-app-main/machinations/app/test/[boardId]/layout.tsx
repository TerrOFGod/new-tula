import { BoardTitle } from "./_components/BoardInfoModal/BoardTitle";
import BoardSidebar from "./_components/sidebar/sidebar-board";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: {
    boardId: string;
  };
}

const DashboardLayout = ({ children, params }: DashboardLayoutProps) => {
  return (
    // <main className="relative min-h-screen md:flex overflow-hidden">
    //   <BoardSidebar params={params}/>
    //   <main
    //     id="content"
    //     className="flex-1 bg-gray-100 max-h-screen overflow-y-auto"
    //   >
        <div className="max-w-full mx-auto h-full">
                   {/* <InfoBoard boardId={params.boardId} /> */}
          <div className="h-full">{children}</div>
        </div>
    //    </main>
    //  </main>
  );
};

export default DashboardLayout;
