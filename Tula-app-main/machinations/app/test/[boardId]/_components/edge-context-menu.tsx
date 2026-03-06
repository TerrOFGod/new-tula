/* eslint-disable react-hooks/rules-of-hooks */
// ==================== Добавление переключения типа ребра через контекстное меню (необязательно) ====================
// Создадим компонент EdgeContextMenu аналогично context-menu.tsx для узлов.
// В flow.tsx добавим обработчик onEdgeContextMenu и покажем это меню.

// app/test/[boardId]/_components/edge-context-menu.tsx
import React, { useCallback, useState } from 'react';
import { useReactFlow } from 'reactflow';
import { ConnectionType } from '@/app/types/structs';
import useStore from '@/app/store/store';

interface EdgeContextMenuProps {
  id: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  onClose: () => void;
}

export default function EdgeContextMenu({ id, top, left, right, bottom, onClose }: EdgeContextMenuProps) {
  const { setEdgeConnectionType } = useStore();
  const { setEdges } = useReactFlow();

  const setResource = useCallback(() => {
    setEdgeConnectionType(id, ConnectionType.RESOURCE);
    onClose();
  }, [id, setEdgeConnectionType, onClose]);

  const setTrigger = useCallback(() => {
    setEdgeConnectionType(id, ConnectionType.TRIGGER);
    onClose();
  }, [id, setEdgeConnectionType, onClose]);

  return (
    <div style={{ position: 'absolute', top, left, right, bottom }} className="context-menu">
      <button onClick={setResource}>Ресурсное (сплошное)</button>
      <button onClick={setTrigger}>Триггерное (пунктирное)</button>
    </div>
  );
}