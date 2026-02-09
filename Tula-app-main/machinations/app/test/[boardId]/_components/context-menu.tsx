import React, { useCallback } from "react";
import { Node, useReactFlow } from "reactflow";
import "./../style-test.css"
import { useChangeEdgeType } from "@/app/store/use-custom-edge";

interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  top?: any | boolean; // Выбор между числом и строкой для стилей
  left?: any | boolean;
  right?: any | boolean; // Необязательные свойства
  bottom?: any | boolean;
}

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}: ContextMenuProps): React.JSX.Element {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const {setAnalytics} = useChangeEdgeType()
  const duplicateNode = useCallback(() => {
    const node: any = getNode(id);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({
      ...node,
      selected: false,
      dragging: false,
      id: `${node.id}-copy`,
      position,
    });
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);


  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      {...props}
    >
      <button onClick={duplicateNode}>Copy</button>
      <button onClick={deleteNode}>Delete</button>
      <button onClick={() => setAnalytics(true)}>Analytics</button>
    </div>
  );
}
