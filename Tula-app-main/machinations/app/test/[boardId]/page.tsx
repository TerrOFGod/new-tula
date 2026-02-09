import Flow from "./_components/Flow";
import { Room } from "@/components/room";
import { Loading } from "@/components/loading";

interface TestIdPageProps {
  params: {
    boardId: string;
  };
}

const TestIdPage = ({ params }: TestIdPageProps) => {
  return (
    <Room roomId={params.boardId} fallback={<Loading />}>
      <Flow boardId={params.boardId} />
    </Room>
  );
};

export default TestIdPage;
