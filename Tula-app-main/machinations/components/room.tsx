"use client";

import { ClientSideSuspense } from "@liveblocks/react";
import { LiveMap, LiveList, LiveObject } from "@liveblocks/client";

import { RoomProvider } from "@/liveblocks.config";
import { Layer } from "@/app/types/canvas";
import useStore from "@/app/store/store";
import { useEffect } from "react";

interface RoomProps {
  children: React.ReactNode;
  roomId: string;
  fallback: NonNullable<React.ReactNode> | null;
}

export const Room = ({ children, roomId, fallback }: RoomProps) => {
  const {
    liveblocks: { enterRoom, leaveRoom },
  } = useStore();

  useEffect(() => {
    enterRoom(roomId);
    return () => leaveRoom();
  }, [enterRoom, leaveRoom, roomId]);

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
        selection: [],
        // для рисования карандашем
        pencilDraft: null,
        penColor: null,
      }}
      initialStorage={{
        layers: new LiveMap<string, LiveObject<Layer>>(),
        layerIds: new LiveList([]),
      }}
    >
      <ClientSideSuspense fallback={fallback}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};
