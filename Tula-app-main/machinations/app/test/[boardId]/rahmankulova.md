# Project Structure

```
_components/
  _structs/
    nodeComponents/
      consumerNode.tsx
      converterNode.tsx
      delayNode.tsx
      endNode.tsx
      gateNode.tsx
      nodeStyle.css
      poolNode.tsx
      randomNode.tsx
      sourceNode.tsx
      styled-node.tsx
    custom-edge.tsx
    custom-node.tsx
  BoardInfoModal/
    BoardInfoModal.module.scss
    BoardInfoModal.tsx
    BoardTitle.tsx
  editor/
    editor.module.scss
    editorCoder.tsx
  HistoryModal/
    CollapsibleGroup/
      CollapsibleGroup.module.scss
      CollapsibleGroup.tsx
      index.ts
    HistoryItem/
      HistoryItem.module.scss
      HistoryItem.tsx
      index.ts
    datepicker.css
    HistoryModal.module.scss
    HistoryModal.tsx
    index.ts
  metrics/
    chart.tsx
    chartCard.tsx
    circleChart.tsx
    metrics.tsx
    metricsData.tsx
  panels/
    bottom-panel.tsx
    EdgeTypePanel.tsx
    toolbar.tsx
  sidebar/
    sidebar-board.tsx
  ui/
    EditableText/
      EditableText.module.scss
      EditableText.tsx
      index.ts
    CustomInput.tsx
    DownloadBtn.tsx
    index.ts
    ToolButton.tsx
  context-menu.tsx
  cursor.tsx
  flow.tsx
  games.tsx
  iterations.tsx
layout.tsx
page.tsx
style-test.css
```


## _components\_structs\nodeComponents\consumerNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const ConsumerNode = ({
  data: { label, struct, name },
  selected,
}: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (nodeId === null) return;
    if (!isPlay) {
      setNodeLabel(nodeId, 0);
    } else {
      setNodeLabel(nodeId, 1);
      let sourceEdge: Edge<Number> = edges.find(
        (edge) => edge?.target === nodeId
      )!;
      // тут в sourceEdge.data хранится значение количество ресурсов
      let targetEdge: Edge<Number> = edges.find(
        (edge) => edge?.source === nodeId
      )!;

      // тут в targetEdge.data хранится значение количества млсекунд * 1000 - то что задержка

      let targetNodeId: Node<any> = nodes.find(
        (node) => node.id === targetEdge?.target
      )!;
      let initialData = +sourceEdge?.data! || 0;

      intervalId = setInterval(() => {
        // Увеличиваем значение sourceEdge.data каждую секунду на 1
        initialData += +sourceEdge?.data!;

        // Обновляем метку узла с новым значением sourceEdge.data
        setNodeLabel(targetNodeId?.id, +initialData);
      }, time * 1000); // Интервал в миллисекундах (1000 миллисекунд = 1 секунда)
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(ConsumerNode);
```


## _components\_structs\nodeComponents\converterNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import { Edge, NodeResizer, useEdges, useNodeId, useNodes } from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const ConverterNode = ({
  data: { label, struct, name },
  selected,
}: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (isPlay) {


      let newEdges: Edge[] = edges.filter((edge) => edge.target === nodeId)
      let nodeIds: string[] = newEdges.map((edge) => edge.source);

      if (nodeIds.length > 0) {
        nodeIds.forEach(nodeId => {
            let foundNode = nodes.find(node => node.id === nodeId);
            let edge = edges.find(edge => edge.source === foundNode?.id)
            if (foundNode) {
                if (+foundNode.data?.label > edge?.data) {
                    setNodeLabel(foundNode.id, foundNode.data?.label - edge?.data);
                }
            }
        });
    }

      const sumOfData = newEdges.reduce((accumulator, currentEdge) => {
        return accumulator + (+currentEdge.data || 0); 
      }, 0);
      intervalId = setInterval(() => {


        setNodeLabel(nodeId!, (parseInt(label) + sumOfData));
      }, time * 1000);
    }

    return () => clearInterval(intervalId!);

  }, [isPlay, onStop, onReset, label]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(ConverterNode);
```


## _components\_structs\nodeComponents\delayNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const DelayNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (!isPlay) {
      setNodeLabel(nodeId!, 0);
    } else {
      setNodeLabel(nodeId!, 1);
      let sourceEdge: Edge<any> = edges.find((edge) => edge?.target === nodeId)!;
      // тут в sourceEdge.data хранится значение количество ресурсов
      let targetEdge: Edge<any> = edges.find((edge) => edge?.source === nodeId)!;

      // тут в targetEdge.data хранится значение количества млсекунд * 1000 - то что задержка

      let targetNodeId: Node<any> = nodes.find(
        (node) => node.id === targetEdge?.target
      )!;
      let initialData = +sourceEdge?.data || 0;

      intervalId = setInterval(() => {
        // Увеличиваем значение sourceEdge.data каждую секунду на 1
        initialData += +sourceEdge?.data;

        // Обновляем метку узла с новым значением sourceEdge.data
        setNodeLabel(targetNodeId?.id, +initialData);
      }, time * 1000); // Интервал в миллисекундах (1000 миллисекунд = 1 секунда)
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(DelayNode);
```


## _components\_structs\nodeComponents\endNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const EndNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (!isPlay) {
      setNodeLabel(nodeId!, 0);
    } else {
      setNodeLabel(nodeId!, 1);
      let sourceEdge: Edge<any> = edges.find((edge) => edge?.target === nodeId)!;
      // тут в sourceEdge.data хранится значение количество ресурсов
      let targetEdge: Edge<any> = edges.find((edge) => edge?.source === nodeId)!;

      // тут в targetEdge.data хранится значение количества млсекунд * 1000 - то что задержка

      let targetNodeId: Node<any> = nodes.find(
        (node) => node.id === targetEdge?.target
      )!;
      let initialData = +sourceEdge?.data || 0;

      intervalId = setInterval(() => {
        // Увеличиваем значение sourceEdge.data каждую секунду на 1
        initialData += +sourceEdge?.data;

        // Обновляем метку узла с новым значением sourceEdge.data
        setNodeLabel(targetNodeId?.id, +initialData);
      }, time * 1000); // Интервал в миллисекундах (1000 миллисекунд = 1 секунда)
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(EndNode);
```


## _components\_structs\nodeComponents\gateNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const GateNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (!isPlay) {
      setNodeLabel(nodeId!, 0);
    } else {
      setNodeLabel(nodeId!, 1);

      let sourceEdge: Edge<any> = edges.find(
        (edge) => edge?.target === nodeId
      )!;
      // тут в sourceEdge.data хранится значение количество ресурсов
      let targetEdge: Edge<any> = edges.find(
        (edge) => edge?.source === nodeId
      )!;

      // тут в targetEdge.data хранится значение количества млсекунд * 1000 - то что задержка
      let targetNodeId: Node<any> = nodes.find(
        (node) => node.id === targetEdge?.target
      )!;
      let initialData = +sourceEdge?.data || 0;

      intervalId = setInterval(() => {
        // Увеличиваем значение sourceEdge.data каждую секунду на 1
        initialData += +sourceEdge?.data;

        // Обновляем метку узла с новым значением sourceEdge.data
        setNodeLabel(targetNodeId?.id, +initialData);
      }, time * 1000); // Интервал в миллисекундах (1000 миллисекунд = 1 секунда)
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(GateNode);
```


## _components\_structs\nodeComponents\nodeStyle.css

```css
.delayNode{
    border: 2px solid red;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 5px;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.consumerNode{
    border: 2px solid blue;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.converterNode{
    border: 2px solid blue;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.endNode{
    border: 2px solid black;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 5px;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.gateNode{
    border: 2px solid blue;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.poolNode{
    border: 2px solid blue;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.sourceNode{
    border: 2px solid greenyellow;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.randomNode{
    border: 2px solid red;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 5px;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}
```


## _components\_structs\nodeComponents\poolNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  id: string;
  data: {
    label: string;
    struct: StructType;
    name?: string | undefined;
  };
  selected: boolean;
}

const PoolNode = ({
  data: { label, struct, name },
  selected,
  id,
}: DataProps) => {
  const { isPlay, onStop, onReset, time, gamesCount, resetNodes } =
    useAnimateScheme();

  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (isPlay) {
      let newEdges = edges.filter((edge) => edge.target === nodeId);
      const sumOfData = newEdges.reduce((accumulator, currentEdge) => {
        return accumulator + (+currentEdge.data || 0);
      }, 0);
      intervalId = setInterval(() => {
        setNodeLabel(nodeId!, parseInt(label) + sumOfData);
      }, time * 1000);
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset, label, gamesCount]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />

      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(PoolNode);
```


## _components\_structs\nodeComponents\randomNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const RandomNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();



  useEffect(() => {
    let intervalId = null;
    if (isPlay) {
      const initialValue = label || null
      let newEdges: Edge[] = edges.filter((edge) => edge.source === nodeId)
      let nodeIds: string[] = newEdges.map(edge => edge.target)      //идишники нод
      
    //   intervalId = setInterval(() => {

    //     setNodeLabel(nodeId, (parseInt(label) + sumOfData).toString());
    //   }, time * 1000);

    
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset, label]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(RandomNode);
```


## _components\_structs\nodeComponents\sourceNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import { Edge, NodeResizer, useEdges, useNodeId, useNodes } from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const SourceNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges();
  const nodes = useNodes();

  useEffect(() => {
    let intervalIds: NodeJS.Timeout[] = [];

    if (isPlay && nodeId) {
      let targetEdges: Edge[] = edges.filter((edge) => edge?.source === nodeId);
      targetEdges.forEach((edge) => {
        const targetNode = nodes.find((node) => node.id === edge.target);
        if (!targetNode) return;

        let initialData = 0;

        const intervalId = setInterval(() => {
          initialData += +edge.data;
          setNodeLabel(targetNode?.id!, +initialData);
        }, time * 1000);

        intervalIds.push(intervalId);
      });
    }
    return () => {
      intervalIds.forEach((intervalId) => clearInterval(intervalId));
    };
  }, [isPlay, onStop, onReset, edges, nodeId, nodes, time, setNodeLabel]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(SourceNode);
```


## _components\_structs\nodeComponents\styled-node.tsx

```tsx
"use client";
import {
  ArrowLeftRight,
  Recycle,
  Dices,
  Hourglass,
  Play,
  CheckCheck,
  LucideIcon,
  Minus,
} from "lucide-react";
import "./nodeStyle.css";
import { StructType } from "@/app/types/structs";
import { Handle, Position, useNodeId } from "reactflow";
import { useState } from "react";
import useStore from "@/app/store/store";

interface ITestNodeProps {
  struct: StructType;
  label: string;
  name?: string;
}

type StructStyles = {
  [key in StructType]: string;
};

interface StructIcons {
  [key: string]: LucideIcon;
}

const styleNode: StructStyles = {
  Consumer: "consumerNode",
  Converter: "converterNode",
  Delay: "delayNode",
  End: "endNode",
  Gate: "gateNode",
  Pool: "poolNode",
  Random: "randomNode",
  Source: "sourceNode",
};

const styleNodeIcon: any = {
  Source: <Play />,
  Converter: <Recycle />,
  Consumer: <Minus />,
  Delay: <Hourglass />,
  Gate: <ArrowLeftRight />,
  Random: <Dices />,
  End: <CheckCheck />,
};

export const StyledNode = ({ struct, label, name }: ITestNodeProps) => {
  const { setNodeName } = useStore();
  const nodeId = useNodeId();

  const [value, setValue] = useState(name);
  const onChange = (event: any) => {
    setValue(event.target.value);
    setNodeName(nodeId!, event.target.value);
  };

  return (
    <div>
      {struct !== StructType.Source && (
        <Handle type={"target"} position={Position.Left} />
      )}
      <div className={styleNode[struct]}>
        {struct in styleNodeIcon ? styleNodeIcon[struct] : label}
        {/* {label} */}
      </div>
      {struct !== StructType.End && (
        <Handle type="source" position={Position.Right} />
      )}
      <div className="h-full w-full flex justify-center">
        <input
          className="bg-transparent w-[50px] border-none text-xs font-bold text-center"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
```


## _components\_structs\custom-edge.tsx

```tsx
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import useStore from "@/app/store/store";
import React, { useEffect, useState } from "react";

import {
  BaseEdge,
  BezierEdge,
  EdgeLabelRenderer,
  EdgeProps,
  StepEdge,
  getBezierPath,
  getStraightPath,
} from "reactflow";

export default function CustomEdge(props: EdgeProps) {
  const {
    error,
    setError,
    currentEdgesType: currentType,
  } = useChangeEdgeType();
  const [localError, setLocalError] = useState<string | null>(null);

  const { setEdgeData } = useStore();
  const {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    id,
    data: initalValue,
  } = props;

  const [inputValue, setInputValue] = useState<number>(initalValue ?? 1);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [basePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const onChange = (event: any) => {
    const newValue = event.target.value;

    if (typeof +newValue !== "number" || isNaN(+newValue)) {
      setLocalError("Must be a numeric");
      setError("error");
      setInputValue(newValue);
    } else {
      setLocalError(null);
      setError(null);
      setInputValue(newValue);
      setEdgeData(id, +newValue);
    }
  };

  useEffect(() => {
    if (typeof +inputValue !== "number" || isNaN(+inputValue)) {
      setLocalError("Must be a numeric");
      setError("error");
    } else {
      setLocalError(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initalValue]);

  return (
    <>
      {currentType === "SmoothStep" && <StepEdge {...props} />}
      {currentType === "Default" && <BaseEdge path={basePath} {...props} />}
      {currentType == "Bezier" && <BezierEdge {...props} />}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <input
            className={
              localError
                ? "border-2 border-red-500 w-16 h-7 text-center rounded-sm"
                : "w-16 h-7 text-center rounded-sm"
            }
            value={inputValue}
            onChange={onChange}
          />
          {localError && (
            <p className="text-center text-2 font-bold text-red-500">
              {localError}
            </p>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
```


## _components\_structs\custom-node.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import { NodeResizer, useEdges, useNodeId } from "reactflow";
import useStore from "@/app/store/store";
import { StyledNode } from "./nodeComponents/styled-node";
import { StructType } from "@/app/types/structs";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const CustomNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, time, onReset, isReset } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();

  useEffect(() => {
    let newEdges = edges.filter((edge) => edge.target === nodeId);

    let { sourceStruct, sourceValue, targetValue } = getEdgeValues(
      newEdges[0]?.id
    );
  
    const sumOfData = newEdges.reduce((accumulator, currentEdge) => {
      return accumulator + (+currentEdge.data! || 0);
    }, 0);

    let intervalId: any;
    const intervalCallback = () => {
      setNodeLabel(nodeId!, parseInt(label) + sumOfData);
    };

    if (isPlay) {
      intervalId = setInterval(intervalCallback, time * 1000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [label, nodeId, isPlay, onReset, setNodeLabel, edges]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(CustomNode);
```


## _components\BoardInfoModal\BoardInfoModal.module.scss

```scss
.board {
  background: white;
  height: 800px;
  width: 300px;
  z-index: 1000;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.board h1 {
  font-size: 16px !important;
  padding-bottom: 10px;
}

.hint_btn {
  background: transparent;
  font-size: 20px !important;
  font-weight: 700;
  color: black;
  padding: 0;
}

.content {
  width: 100%;
  height: 100%;
  position: relative;
}
.content__items {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.date_info {
  position: absolute;
  bottom: 1rem;
  > h2 {
    padding-bottom: 0.5rem;
  }
}

.description {
  display: flex;
  flex-direction: column;
  > textarea {
    height: 270px;
    padding: 1rem 0.5rem;
    background: rgb(233, 238, 252);
    border-radius: 10px;
    border: 1px dashed white;
    margin-bottom: 15px;
  }
}
.saveButton {
  padding: 5px 10px;
  background-color: #000000; /* Красный цвет */
  color: #fff; /* Белый цвет текста */
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.closeButton {
  top: 0;
  right: 0;
  padding: 5px 10px;
  background-color: #000000; /* Красный цвет */
  color: #fff; /* Белый цвет текста */
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.closeButton:hover {
  background-color: #cc0000; /* Темно-красный цвет при наведении */
}
```


## _components\BoardInfoModal\BoardInfoModal.tsx

```tsx
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
```


## _components\BoardInfoModal\BoardTitle.tsx

```tsx
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
```


## _components\editor\editor.module.scss

```scss
.editor_btn {
  background: rgb(24, 24, 24);
  width: 450px;
  display: flex;
  color: white;
  justify-content: space-between;
}
.generate {
  margin: 20px;
  width: 100%;
}
.reset {
  margin: 20px;
  width: 100%;
}
```


## _components\editor\editorCoder.tsx

```tsx
"use client";

import { parseCodeToTemplate } from "@/app/services/parserCode";
import MonacoEditor from "@monaco-editor/react";
import { useState } from "react";
import styles from "./editor.module.scss";
import { useRenameModal } from "@/app/store/use-rename-modal";
import { ITemplate, generateSheme } from "@/app/services/generateSheme";
import { useGenerate } from "@/app/store/useBoardInfo";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import useStore from "@/app/store/store";
import { parserToJson } from "@/app/services/parserToJson";

const EditorComponent = () => {
  const [code, setCode] = useState("");
  const { setIsVisisble } = useRenameModal();
  const { setDescription, description } = useGenerate();
  const { setTime, setGames, setIterations, iterations, games, time } =
    useAnimateScheme();
  const { generateNode, generateEdge, getNodesJson, getEdgesJson } = useStore();
  const { onChangeEdgesType, currentEdgesType } = useChangeEdgeType();

  const handleCodeChange = (newCode: any) => {
    setCode(newCode);
  };

  const handleBuildScheme = () => {
    const template: ITemplate | null = parseCodeToTemplate(code);
    generateSheme(
      template,
      setDescription,
      onChangeEdgesType,
      setGames,
      setIterations,
      setTime,
      generateNode,
      generateEdge
    );
  };

  const handleBuildJson = () => {
    const res = parserToJson(
      description,
      currentEdgesType,
      iterations,
      games,
      time,
      getNodesJson,
      getEdgesJson
    );
    setCode(res);
  };

  return (
    <div className="flex flex-col h-full">
      <MonacoEditor
        width={450}
        height="100%"
        defaultLanguage="json"
        theme="vs-dark"
        value={code}
        options={{ selectOnLineNumbers: true }}
        onChange={handleCodeChange}
      />
      <div className={styles.editor_btn}>
        <button
          onClick={() => {
            handleBuildScheme();
          }}
          className={styles.generate}
        >
          Generate
        </button>
        <button onClick={() => setCode("")} className={styles.reset}>
          Reset
        </button>
        <button onClick={handleBuildJson} className={styles.reset}>
          Build
        </button>
      </div>
    </div>
  );
};

export default EditorComponent;
```


## _components\HistoryModal\CollapsibleGroup\CollapsibleGroup.module.scss

```scss
.group {
  margin-bottom: 1rem;

  &Header {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    color: #5f6368;
    font-size: 14px;
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 12px;

    &:hover {
      background: #f1f3f5;
    }
  }

  &Content {
    padding: 0.5rem;
  }
}

.toggleIcon {
}
```


## _components\HistoryModal\CollapsibleGroup\CollapsibleGroup.tsx

```tsx
// components/CollapsibleGroup.tsx
import { useState } from "react";

import styles from "./CollapsibleGroup.module.scss";

type TCollapsibleGroupProps = {
  title: string;
  children: React.ReactNode;
};

export const CollapsibleGroup = ({
  title,
  children,
}: TCollapsibleGroupProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.group}>
      <div className={styles.groupHeader} onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        <span className={styles.toggleIcon}>{isOpen ? "▼" : "▶"}</span>
      </div>
      {isOpen && <div className={styles.groupContent}>{children}</div>}
    </div>
  );
};
```


## _components\HistoryModal\CollapsibleGroup\index.ts

```ts
export { CollapsibleGroup } from "./CollapsibleGroup";
```


## _components\HistoryModal\HistoryItem\HistoryItem.module.scss

```scss
.versionItem {
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: background 0.1s;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;

  &:hover {
    background: #f8f9fa;
  }

  &.selected {
    border-color: #1971c2;
    background-color: #f8f9fa;
  }

  &Header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;
  }

  &Meta {
    display: flex;
    gap: 0.5rem;
    color: #868e96;
    font-size: 0.875rem;

    &Time {
      font-size: 14px;
      color: #202124;
    }
  }

  &Content {
    display: flex;
    flex-direction: column;

    &Message {
      font-size: 14px;
      color: #5f6368;
      margin-top: 8px;
      font-style: italic;
      padding-left: 6px;
    }

    &Colabarator {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #5f6368;
      padding-left: 8px;
    }
  }

  &Actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 16px;
  }
}

.swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #26a69a;
}
```


## _components\HistoryModal\HistoryItem\HistoryItem.tsx

```tsx
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
```


## _components\HistoryModal\HistoryItem\index.ts

```ts
export { HistoryItem } from "./HistoryItem";
```


## _components\HistoryModal\datepicker.css

```css

```


## _components\HistoryModal\HistoryModal.module.scss

```scss
.historySidebar {
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  height: 100vh;
  width: 432px;
  z-index: 1000;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.content {
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;
  padding-right: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.revisionsList {
  flex: 1;
  overflow-y: auto;
}

.switch {
  width: 42px;
  height: 25px;
  background-color: #4e4c4cb3;
  border-radius: 9999px;
  position: relative;
  box-shadow: 0 2px 10px #00000080;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  &:focus {
    // box-shadow: 0 0 0 2px black;
  }

  &[data-state="checked"] {
    background-color: rgb(61, 175, 72);
  }

  &Wrapper {
    display: flex;
    align-items: center;
    margin: 16px 0px;
  }

  &Thumb {
    display: block;
    width: 21px;
    height: 21px;
    background-color: white;
    border-radius: 9999px;
    box-shadow: 0 2px 2px #00000080;
    transition: transform 100ms;
    transform: translateX(2px);
    will-change: transform;
    &[data-state="checked"] {
      transform: translateX(19px);
    }
  }

  &Label {
    padding-right: 16px;
    font-size: 16px;
    line-height: 1;
    user-select: none;
  }
}

.searchInput {
  margin-bottom: 16px;
  border-color: hsl(218deg 34.85% 74.85%);
  outline: none;

  &:focus-visible {
    box-shadow: none;
    border-color: #3498db;
  }
}

.datePickerLabel {
  font-size: 16px;
  line-height: 1;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  padding-bottom: 8px;
}

.datePickerInput {
  & input {
    border: 1px solid hsl(218deg 34.85% 74.85%);
    border-radius: calc(0.5rem - 2px);
    padding: 0.5rem 0.75rem;
    padding-left: 32px;
    font-size: 0.875rem;
    line-height: 1.25rem;

    &:focus-visible {
      border-color: #3498db;
      outline: none;
    }
  }

  & button {
    font-size: 13px;
  }

  & svg {
    padding-top: 10px !important;
  }
}

.dateGroup {
  color: #5f6368;
  font-size: 14px;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 12px;
}

.tile {
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &.selected {
    border-color: #1a73e8;
    background-color: #f8f9fa;
  }
}

.tileHeader {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.time {
  font-size: 14px;
  color: #202124;
}

.restoreButton {
  margin-left: auto;
  background: none;
  border: none;
  color: #1a73e8;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  margin-top: 4px;
  align-self: flex-end;

  &:hover {
    background: #e8f0fe;
  }
}

.collaborator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #5f6368;
  padding-left: 8px;
}

.swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #26a69a;
}

.message {
  font-size: 14px;
  color: #5f6368;
  margin-top: 8px;
  font-style: italic;
  padding-left: 6px;
}

.sortType {
  cursor: pointer;
  margin-left: auto;
}

.spinnerWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-block: 16px;
}

// SCSS
.spinner {
  $size: 50px;
  $color: #3498db;
  $thickness: 4px;
  $animation-duration: 1s;

  display: inline-block;
  margin-left: auto;
  margin-right: auto;
  align-self: center;
  width: $size;
  height: $size;
  border: $thickness solid rgba($color, 0.2);
  border-radius: 50%;
  border-top-color: $color;
  animation: spin $animation-duration ease-in-out infinite;
  -webkit-animation: spin $animation-duration ease-in-out infinite;
  position: relative;

  // Вариант с дополнительными градиентами
  &::after {
    content: "";
    position: absolute;
    top: -$thickness;
    left: -$thickness;
    right: -$thickness;
    bottom: -$thickness;
    border-radius: 50%;
    border: $thickness solid transparent;
    border-top-color: rgba($color, 0.5);
    animation: spin ($animation-duration * 1.5) ease-in-out infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
  }

  // Модификаторы размеров
  &--small {
    width: $size * 0.5;
    height: $size * 0.5;
    border-width: $thickness * 0.5;
  }

  &--large {
    width: $size * 2;
    height: $size * 2;
    border-width: $thickness * 1.5;
  }

  // Цветовые варианты
  &--primary {
    border-top-color: $color;
    &::after {
      border-top-color: rgba($color, 0.5);
    }
  }

  &--secondary {
    border-top-color: #2ecc71;
    &::after {
      border-top-color: rgba(#2ecc71, 0.5);
    }
  }

  &--white {
    border-top-color: white;
    &::after {
      border-top-color: rgba(white, 0.5);
    }
  }
}

/* Chrome, Edge and Safari */
.content::-webkit-scrollbar {
  height: 7px;
  width: 7px;
}

.content::-webkit-scrollbar-track {
  background-color: #c7e0e4ff;
  border-radius: 5px;
  border: 0px solid #ffffffff;
}

.content::-webkit-scrollbar-track:hover {
  background-color: #acc6caff;
}

.content::-webkit-scrollbar-track:active {
  background-color: #acc6caff;
}

.content::-webkit-scrollbar-thumb {
  background-color: #6b8484ff;
  border-radius: 10px;
  border: 0px solid #ffffffff;
}

.content::-webkit-scrollbar-thumb:hover {
  background-color: #3a4545ff;
}

.content::-webkit-scrollbar-thumb:active {
  background-color: #3a4545ff;
}
```


## _components\HistoryModal\HistoryModal.tsx

```tsx
"use client";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Panel } from "reactflow";
import { AArrowDown, AArrowUp, CalendarDays } from "lucide-react";
import { useConvex, useQuery } from "convex/react";
import { toast } from "sonner";
import { DiffEditor } from "@monaco-editor/react";
import { Switch } from "radix-ui";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import useStore from "@/app/store/store";
import { BoardStateData } from "@/app/types/history";
import { Input } from "@/components/ui/input";
import infoBoardStyles from "../BoardInfoModal/BoardInfoModal.module.scss";

import { CollapsibleGroup } from "./CollapsibleGroup";
import { HistoryItem } from "./HistoryItem";
import "./datepicker.css";
import styles from "./HistoryModal.module.scss";

interface IHistoryModalProps {
  boardId: string;
  onSaveRestoredVersion: (
    isRestore?: boolean,
    restoredVersionTime?: number,
    restoredVersionMessage?: string
  ) => void;
  onClose: () => void;
}

type BoardHistoryVersion = Doc<"boardsHistory">;
type GroupedHistory = Record<string, BoardHistoryVersion[]>;

type THistoryFiltersType = {
  search: string;
  dateRange: { start: Date | null; end: Date | null };
  groupByDate: boolean;
  groupByBase: boolean;
  sort: "asc" | "desc";
};

const DEFAULT_FILTERS: THistoryFiltersType = {
  search: "",
  dateRange: { start: null, end: null },
  groupByDate: true,
  groupByBase: false,
  sort: "asc",
};

export const HistoryModal: FC<IHistoryModalProps> = ({
  boardId,
  onSaveRestoredVersion,
  onClose,
}) => {
  const convex = useConvex();
  // const history = useQuery(api.boardsHistory.getBoardHistory, {
  //   boardId: boardId as Id<"boards">,
  // });

  const { currentVersion } = useStore();
  const [selectedVersionId, setSelectedVersionId] = useState<string>();
  const [currentVersionData, setCurrentVersionData] =
    useState<BoardStateData>();
  const [selectedVersionData, setSelectedVersionData] =
    useState<BoardStateData>();
  const [filters, setFilters] = useState<THistoryFiltersType>(DEFAULT_FILTERS);
  // const [compareMode, setCompareMode] = useState(false);

  const history = useQuery(api.boardsHistory.getBoardHistory, {
    boardId: boardId as Id<"boards">,
    searchQuery: filters.search,
    startDate: filters.dateRange.start?.getTime(),
    endDate: filters.dateRange.end?.getTime(),
    groupByBase: filters.groupByBase,
  });

  const getCurrentVersionData = useCallback(async () => {
    const boardVersion = await convex
      .query(api.boardsHistory.getVersionByNumber, {
        boardId: boardId as Id<"boards">,
        version: currentVersion,
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

      setCurrentVersionData(restoredVersion);
    } catch (error) {
      toast.error("Ошибка при восстановлении версии в истории");
    }
  }, [boardId, convex, currentVersion]);

  useEffect(() => {
    getCurrentVersionData();
  }, [getCurrentVersionData]);

  const handleShowDiff = useCallback(
    async (versionId: Id<"boardsHistory">) => {
      try {
        const restoredVersion = await convex.query(
          api.boardsHistory.restoreVersion,
          {
            versionId: versionId,
          }
        );

        setSelectedVersionData(restoredVersion);
      } catch (error) {
        toast.error("Ошибка при восстановлении версии в истории");
      }
    },
    [convex]
  );

  const onItemClick = useCallback(
    async (versionId: Id<"boardsHistory">) => {
      setSelectedVersionId(
        selectedVersionId === versionId ? undefined : versionId
      );
      await handleShowDiff(versionId);
    },
    [handleShowDiff, selectedVersionId]
  );

  const isDateInRange = useCallback((date: Date) => {
    const currentDate = new Date();

    return date < currentDate;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedVersionId) {
        setSelectedVersionId(undefined);
        setSelectedVersionData(undefined);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedVersionId]);

  const groupedHistory = useMemo(() => {
    if (filters.groupByBase && history?.grouped) {
      return Object.entries(history.grouped)
        .sort(([a], [b]) =>
          filters.sort === "asc" ? Number(a) - Number(b) : Number(b) - Number(a)
        )
        .map(([baseVersion, versions]) => (
          <CollapsibleGroup
            key={baseVersion}
            title={`Base Version: ${baseVersion}`}
          >
            {versions
              .sort((a, b) =>
                filters.sort === "asc"
                  ? a.version - b.version
                  : b.version - a.version
              )
              .map((version) => (
                <HistoryItem
                  key={version._id}
                  boardId={boardId}
                  version={version}
                  isSelected={selectedVersionId === version._id}
                  onClick={onItemClick}
                  onSaveRestoredVersion={onSaveRestoredVersion}
                />
              ))}
          </CollapsibleGroup>
        ));
    }

    const groupedByDateHistory = history?.results.reduce((acc, version) => {
      const date = new Date(version._creationTime).toLocaleDateString();

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(version);

      return acc;
    }, {} as GroupedHistory);

    return Object.entries(groupedByDateHistory || {})
      .sort(([a], [b]) => {
        const [dayA, monthA, yearA] = a.split(".").map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA).getTime();

        if (isNaN(dateA)) {
          throw new Error("Invalid date");
        }

        const [dayB, monthB, yearB] = b.split(".").map(Number);
        const dateB = new Date(yearB, monthB - 1, dayB).getTime();

        // 3. Проверка корректности даты
        if (isNaN(dateB)) {
          throw new Error("Invalid date");
        }

        return filters.sort === "asc" ? dateA - dateB : dateB - dateA;
      })
      .map(([date, versions]) => (
        <CollapsibleGroup key={date} title={date}>
          {versions
            .sort((a, b) =>
              filters.sort === "asc"
                ? a._creationTime - b._creationTime
                : b._creationTime - a._creationTime
            )
            .map((version) => (
              <HistoryItem
                key={version._id}
                boardId={boardId}
                version={version}
                isSelected={selectedVersionId === version._id}
                onClick={onItemClick}
                onSaveRestoredVersion={onSaveRestoredVersion}
              />
            ))}
        </CollapsibleGroup>
      ));
  }, [
    filters.groupByBase,
    filters.sort,
    history?.grouped,
    history?.results,
    boardId,
    selectedVersionId,
    onItemClick,
    onSaveRestoredVersion,
  ]);

  return (
    <>
      <div className={styles.historySidebar}>
        <div className={styles.header}>
          <h4 className={styles.title}>Version history</h4>
          <button className={infoBoardStyles.closeButton} onClick={onClose}>
            &#x2716;
          </button>
        </div>
        <div className={styles.filters}>
          <Input
            className={styles.searchInput}
            placeholder="Search by message... 🔎"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            maxLength={50}
          />
          <div className={styles.datePickerLabel}>Filter by date:</div>
          <DatePicker
            wrapperClassName={styles.datePickerInput}
            selected={filters.dateRange.start}
            startDate={filters.dateRange.start}
            endDate={filters.dateRange.end}
            onChange={(update) =>
              setFilters((prev) => ({
                ...prev,
                dateRange: { start: update[0], end: update[1] },
              }))
            }
            filterDate={isDateInRange}
            placeholderText="dd/mm/yyyy - dd/mm/yyyy"
            icon={<CalendarDays />}
            showIcon
            selectsRange
            isClearable
          />
          <div className={styles.switchWrapper}>
            <label className={styles.switchLabel} htmlFor="grouped-mode">
              Group by Base Snapshot
            </label>
            <Switch.Root
              className={styles.switch}
              id="grouped-mode"
              checked={filters.groupByBase}
              onCheckedChange={(checked: boolean) => {
                setFilters((prev) => ({
                  ...prev,
                  groupByBase: checked,
                  groupByDate: !checked,
                }));
              }}
            >
              <Switch.Thumb className={styles.switchThumb} />
            </Switch.Root>
            <div
              className={styles.sortType}
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  sort: prev.sort === "asc" ? "desc" : "asc",
                }));
              }}
            >
              {filters.sort === "asc" ? <AArrowDown /> : <AArrowUp />}
            </div>
          </div>
        </div>
        <div className={styles.content}>
          {!history && (
            <div className={styles.spinnerWrapper}>
              <div className={styles.spinner} />
            </div>
          )}
          <div className={styles.revisionsList}>{groupedHistory}</div>
        </div>
      </div>
      {selectedVersionId && (
        <Panel position="top-left" className="vesrsions-diff_panel">
          <DiffEditor
            height="600px"
            original={JSON.stringify(currentVersionData, null, 2)}
            modified={JSON.stringify(selectedVersionData, null, 2)}
            language="json"
            className={styles.diffEditor}
          />
        </Panel>
      )}
    </>
  );
};

export default HistoryModal;
```


## _components\HistoryModal\index.ts

```ts
export { HistoryModal } from "./HistoryModal";
```


## _components\metrics\chart.tsx

```tsx
"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";

export const Chart = ({ data, title }: any) => {
  return (
    <div>
      <h2 className="pt-2 pb-4 text-center">{title}</h2>
      <AreaChart
        width={350}
        height={220}
        data={data[0]}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="iteration" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="iterations1"
          stroke="red"
          fillOpacity={1}
          fill="url(#colorXv)"
        />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="purple"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="pink"
          fillOpacity={1}
          fill="url(#colorXv)"
        />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="blue"
          fillOpacity={1}
          fill="url(#colorXv)"
        />
      </AreaChart>
    </div>
  );
};
```


## _components\metrics\chartCard.tsx

```tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { MetricsData } from "./metricsData";
import { CircleChart } from "./circleChart";

export const ChartCard = ({ data, gameCount, stroke, dataKey, percent}: any) => {
  return (
    <div>
      <h2 className="pt-2 pb-2 text-center">
        <strong>Game {gameCount}</strong>
      </h2>
      <small className="ml-10"><strong>Value</strong></small>
      <LineChart width={400} height={230} data={data} className="mt-4">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={dataKey} stroke={stroke} />
      </LineChart>
      <small className="w-full flex justify-center items-center text-center m-0">
       <strong>Iterations</strong>
      </small>
      <MetricsData average={100} median={50} min={1} max={100} />
      <CircleChart value={percent} />
    </div>
  );
};
```


## _components\metrics\circleChart.tsx

```tsx
import React, { FC } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#82ca9d", "#8884d8"];

export const CircleChart: FC<{ value: number }> = ({ value }) => {
  const data = [
    { name: "Total amount of resources in the node", value: value },
    { name: "Remaining amount of resources", value: 100 - value },
  ];
  return (
    <div className="mb-3 mx-5">
      <h2 className="pt-1 pb-2 text-center">
        <strong>Resource allocation</strong>
      </h2>
      <PieChart width={400} height={300}>
        <Pie dataKey="value" data={data} fill="#8884d8" label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </div>
  );
};
```


## _components\metrics\metrics.tsx

```tsx
"use client";

import { Panel } from "reactflow";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./../../style-test.css";
import { MetricsData } from "./metricsData";
import { CircleChart } from "./circleChart";
import { ChartCard } from "./chartCard";

const data = [
  {
    name: 0,
    game1: 0,
    game2: 0,
    game3: 0,
    game4: 0,
    game5: 0,
  },
  {
    name: 1,
    game1: 10,
    game2: 5,
    game3: 5,
    game4: 2,
    game5: 10,
  },
  {
    name: 2,
    game1: 20,
    game2: 10,
    game3: 10,
    game4: 4,
    game5: 20,
  },
  {
    name: 3,
    game1: 30,
    game2: 15,
    game3: 15,
    game4: 9,
    game5: 20,
  },
  {
    name: 4,
    game1: 40,
    game2: 15,
    game3: 20,
    game4: 11,
    game5: 30,
  },
  {
    name: 5,
    game1: 50,
    game2: 15,
    game3: 25,
    game4: 13,
    game5: 40,
  },
  {
    name: 6,
    game1: 70,
    game2: 20,
    game3: 30,
    game4: 18,
    game5: 50,
  },
  {
    name: 7,
    game1: 90,
    game2: 25,
    game3: 25,
    game4: 28,
    game5: 60,
  },
  {
    name: 8,
    game1: 110,
    game2: 27,
    game3: 30,
    game4: 38,
    game5: 70,
  },
  {
    name: 9,
    game1: 130,
    game2: 37,
    game3: 25,
    game4: 48,
    game5: 80,
  },
  {
    name: 10,
    game1: 150,
    game2: 47,
    game3: 30,
    game4: 58,
    game5: 90,
  },
];

export const Metrics = () => {
  const { analytics, setAnalytics } = useChangeEdgeType();
  return (
    <Panel position="top-right" className="analytics_panel">
      <button
        className="bg-black rounded py-1 px-2 text-white absolute top-2 left-2"
        onClick={() => setAnalytics(false)} > &#x2716;
      </button>
      <h1 className="pt-2 text-center text-lg">
        <strong>Node statistics (wood)</strong>
      </h1>

      <h2 className="pt-1 pb-4 text-center">
        <strong>All games</strong>
      </h2>
      <small className="ml-10">
        <strong>Value</strong>
      </small>
      <LineChart width={400} height={230} data={data} className="mt-2">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {/* <Legend /> */}
        <Line type="monotone" dataKey="game1" stroke="#82ca9d" />
        <Line type="monotone" dataKey="game2" stroke="#8884d8" />
        <Line type="monotone" dataKey="game3" stroke="pink" />
        <Line type="monotone" dataKey="game4" stroke="blue" />
        <Line type="monotone" dataKey="game5" stroke="purple" />
      </LineChart>
      <small className="w-full flex justify-center items-center text-center m-0">
        <strong>Iterations</strong>
      </small>
      <MetricsData
        average={100}
        median={50}
        min={1}
        max={100}
        std={37}
        range={1}
      />
      <ChartCard data={data} gameCount={1} stroke="#82ca9d" dataKey="game1" percent={14}/>
      <ChartCard data={data} gameCount={2} stroke="#8884d8" dataKey="game2" percent={64}/>
      <ChartCard data={data} gameCount={3} stroke="pink" dataKey="game3" percent={92}/>
      <ChartCard data={data} gameCount={4} stroke="blue" dataKey="game4" percent={45}/>
      <ChartCard data={data} gameCount={5} stroke="purple" dataKey="game5" percent={80}/>
    </Panel>
  );
};
```


## _components\metrics\metricsData.tsx

```tsx
"use client";

import { FC } from "react";
import "./../../style-test.css";

interface MetricsDta {
  average: number;
  median: number;
  min: number;
  max: number;
  std?: number;
  range?: number;
}

export const MetricsData: FC<MetricsDta> = ({
  average,
  median,
  max,
  min,
  std,
  range,
}) => {
  return (
    <div className="values_analytics">
      <div className="analytics__title">
        <h2>
          <strong>Metrics</strong>
        </h2>
        <h2>
          <strong>Value</strong>
        </h2>
      </div>
      <hr />
      <div className="analytics__title">
        <h2>Average value (AVR)</h2>
        <h2>{average}</h2>
      </div>
      <div className="analytics__title">
        <h2>Median (MEDIAN)</h2>
        <h2>{median}</h2>
      </div>
      <div className="analytics__title">
        <h2>Minimum value (MIN)</h2>
        <h2>{min}</h2>
      </div>
      <div className="analytics__title">
        <h2>Maximum value (MAX)</h2>
        <h2>{max}</h2>
      </div>
      {std && (
        <div className="analytics__title">
          <h2>Standard Deviation (STD)</h2>
          <h2>{std}</h2>
        </div>
      )}
      {range && (
        <div className="analytics__title">
          <h2>Range (RANGE)</h2>
          <h2>{range}</h2>
        </div>
      )}
      <hr/>
    </div>
  );
};
```


## _components\panels\bottom-panel.tsx

```tsx
import { Panel, useEdges, useNodes } from "reactflow";
import { ToolButton } from "../ui/ToolButton";
import { Play, RotateCcw, Pause } from "lucide-react";
import CustomInput from "../ui/CustomInput";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import useStore from "@/app/store/store";
import { useEffect } from "react";
import { Iterations } from "../iterations";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import { Games } from "../games";

export const BottomPanel = () => {
  const { isPlay, onPlay, onStop, onReset, time, iterations, games } = useAnimateScheme();
  const { setEdgeAnimated } = useStore();
  useEffect(() => {
    setEdgeAnimated(isPlay);
  }, [isPlay]);

  const edges = useEdges();
  const nodes = useNodes();
  const { error, setError } = useChangeEdgeType();

  return (
    <Panel position="bottom-center">
      <div className="bg-white rounded-md flex gap-x-2 items-center shadow-md py-2 px-2">
        <div className="mr-2 flex gap-x-2 items-center">
          <CustomInput label="Iterations" initialValue={iterations} />
          <CustomInput label="Time(s)" initialValue={time} />
          <CustomInput label="Games" initialValue={games} />
        </div>
        <ToolButton
          label="Play"
          isDisabled={error ? true : isPlay}
          onClick={onPlay}
          isActive={false}
          icon={Play}
          background="blue"
        />
        <ToolButton
          label="Pause"
          isDisabled={!isPlay}
          onClick={onStop}
          isActive={false}
          icon={Pause}
          background="red"
        />
        <ToolButton
          label="Reset"
          onClick={onReset}
          isActive={false}
          icon={RotateCcw}
          background="red"
        />
        <Iterations />
        <Games />
        <div className="text-xs text-center px-1">
          <label>Total count</label>
          <div>{edges.length + nodes.length}</div>
        </div>
      </div>
    </Panel>
  );
};
```


## _components\panels\EdgeTypePanel.tsx

```tsx
import React from "react";

import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import { EdgesTypes } from "@/app/types/structs";
import useStore from "@/app/store/store";

export const EdgeTypePanel = () => {
  const { onChangeEdgesType } = useChangeEdgeType();
  const { edgesType: currentEdgesTypeValue } = useStore.getState();

  const handleChangeEdgesType = (type: EdgesTypes) => {
    onChangeEdgesType(type);
    useStore.setState({
      edgesType: type,
    });
  };

  return (
    <div className="flex gap-x-2 items-center">
      <button
        className={`bg-blue-100 rounded-md p-2 ${
          currentEdgesTypeValue === EdgesTypes.DEFAULT
            ? "bg-blue-500 text-white"
            : ""
        }`}
        onClick={() => handleChangeEdgesType(EdgesTypes.DEFAULT)}
      >
        Default
      </button>
      <button
        className={`bg-blue-100 rounded-md p-2 ${
          currentEdgesTypeValue === EdgesTypes.SMOOTH_STEP
            ? "bg-blue-500 text-white"
            : ""
        }`}
        onClick={() => handleChangeEdgesType(EdgesTypes.SMOOTH_STEP)}
      >
        SmoothStep
      </button>
      <button
        className={`bg-blue-100 rounded-md mr-16 p-2 ${
          currentEdgesTypeValue === EdgesTypes.BEZIER
            ? "bg-blue-500 text-white"
            : ""
        }`}
        onClick={() => handleChangeEdgesType(EdgesTypes.BEZIER)}
      >
        Bezier
      </button>
    </div>
  );
};
```


## _components\panels\toolbar.tsx

```tsx
import { StructType } from "@/app/types/structs";
import { ToolButton } from "../ui/ToolButton";
import {
  ArrowLeftRight,
  Recycle,
  Play,
  Dices,
  Hourglass,
  CheckCheck,
  Undo,
  Redo,
  BadgePlus,
  BadgeMinus,
  Eraser,
} from "lucide-react";
import useStore, { RFState } from "@/app/store/store";
import { shallow } from "zustand/shallow";

interface ToolbarProps {
  canvasState: CanvasState;
  onClick: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addNode: state.addNode,
});

export const Toolbar = () => {
  const { addNode } = useStore(selector, shallow);
  const { deleteAll } = useStore();

  return (
    <div className="absolute top-40 left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        <ToolButton
          label="Source"
          onClick={() => addNode(StructType.Source)}
          isActive={false}
          icon={Play}
        />
        <ToolButton
          label="Pool"
          onClick={() => addNode(StructType.Pool)}
          isActive={false}
          icon={BadgePlus}
        />
        <ToolButton
          label="Consumer"
          onClick={() => addNode(StructType.Consumer)}
          isActive={false}
          icon={BadgeMinus}
        />
        <ToolButton
          label="Converter"
          onClick={() => addNode(StructType.Converter)}
          isActive={true}
          icon={Recycle}
        />
        <ToolButton
          label="Gate"
          onClick={() => addNode(StructType.Gate)}
          isActive={false}
          icon={ArrowLeftRight}
        />
        <ToolButton
          label="Random"
          onClick={() => addNode(StructType.Random)}
          isActive={false}
          icon={Dices}
        />
        <ToolButton
          label="Delay"
          onClick={() => addNode(StructType.Delay)}
          isActive={false}
          icon={Hourglass}
        />
        <ToolButton
          label="End"
          onClick={() => addNode(StructType.End)}
          isActive={false}
          icon={CheckCheck}
        />
      </div>
      {/* undo redo */}
      <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
        <ToolButton
          label="Undo"
          onClick={() => {}}
          isActive={false}
          icon={Undo}
        />
        <ToolButton
          label="Redo"
          onClick={() => {}}
          isActive={false}
          icon={Redo}
        />
        <ToolButton
          label="Eraser"
          onClick={deleteAll}
          isActive={false}
          icon={Eraser}
        />
      </div>
    </div>
  );
};
```


## _components\sidebar\sidebar-board.tsx

```tsx
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
```


## _components\ui\EditableText\EditableText.module.scss

```scss
.editableContainer {
  cursor: pointer;
}

.editableText {
  padding: 4px 8px;
  border: 1px solid transparent;
  border-radius: 4px;

  &:hover {
    border-color: #ccc;
    background: #f5f5f5;
  }
}

.editableInput {
  padding: 4px 8px;
  border: 1px solid #007bff;
  border-radius: 4px;
  outline: none;
  background: white;

  &:hover {
    border-color: #0056b3;
  }
}
```


## _components\ui\EditableText\EditableText.tsx

```tsx
import { useState, useRef, useEffect, memo } from "react";

import styles from "./EditableText.module.scss";

const EditableText = ({
  initialValue,
  onBlur,
}: {
  initialValue: string;
  onBlur: (value: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);

    if (value.trim() !== initialValue) {
      onBlur(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsEditing(false);

      if (value.trim() !== initialValue) {
        onBlur(value);
      }
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  return (
    <div className={styles.editableContainer}>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={styles.editableInput}
        />
      ) : (
        <div className={styles.editableText} onClick={handleClick}>
          {value}
        </div>
      )}
    </div>
  );
};

export default memo(EditableText);
```


## _components\ui\EditableText\index.ts

```ts
import EditableText from "./EditableText";

export { EditableText };
```


## _components\ui\CustomInput.tsx

```tsx
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect, useState } from "react";

interface CustomInputProps {
  label: string;
  initialValue: number;
}

const CustomInput = ({ label, initialValue }: CustomInputProps) => {
  const { setIterations, setTime, setGames } = useAnimateScheme();
  const [value, setValue] = useState<number>(initialValue);

  useEffect(() => {
    if (label === "Iterations") {
      setIterations(value);
    }
    if (label === "Time(s)") {
      setTime(value);
    }
    if (label === "Games") {
      setGames(value);
    }
  }, [value]);

  return (
    <div className="flex flex-col mx-1">
      <input
        className="w-12 text-sm text-center px-1 border border-black rounded"
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
      />
      <label className="text-xs mt-1 text-center">{label}</label>
    </div>
  );
};

export default memo(CustomInput);
```


## _components\ui\DownloadBtn.tsx

```tsx
import {
  getTransformForBounds,
  useReactFlow,
  getRectOfNodes,
} from "reactflow";
import { ToolButton } from "./ToolButton";
import { Download } from "lucide-react";

import { toPng } from "html-to-image";

function downloadImage(dataUrl: any) {
  const a = document.createElement("a");
  a.setAttribute("download", "scheme.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

export const DownloadBtn = () => {
  const { getNodes } = useReactFlow();
  const onDownload = () => {
    const nodesBounds = getRectOfNodes(getNodes());
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2
    );
    //@ts-ignore
    toPng(document.querySelector(".react-flow__viewport"), {
      backgroundColor: "white",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then(downloadImage);
  };
  return (
    <div>
      <ToolButton
        label="Download PNG"
        onClick={onDownload}
        isActive={false}
        icon={Download}
      />
    </div>
  );
};
```


## _components\ui\index.ts

```ts
import CustomInput from "./CustomInput";
import { EditableText } from "./EditableText";
import { ToolButton } from "./ToolButton";
import { DownloadBtn } from "./DownloadBtn";

export { CustomInput, EditableText, ToolButton, DownloadBtn };
```


## _components\ui\ToolButton.tsx

```tsx
"use client";

import { LucideIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";

interface ToolButtonProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
  background?: string
}

export const ToolButton = ({
  label,
  icon: Icon,
  onClick,
  isActive,
  isDisabled,
  background = "black"
}: ToolButtonProps) => {
  return (
    <Hint label={label}>
      <Button
        disabled={isDisabled}
        onClick={onClick}
        size="icon"
        style={{ margin: "1px", background: background }}
      >
        <Icon />
      </Button>
    </Hint>
  );
};
```


## _components\context-menu.tsx

```tsx
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
```


## _components\cursor.tsx

```tsx
"use client";

import { useOther } from "@/liveblocks.config";
import { MousePointer2 } from "lucide-react";
import { memo } from "react";

interface CursorProps {
  connectionId: number;
}

export const Cursor = memo(({ connectionId }: CursorProps) => {
  const info = useOther(connectionId, (user) => user?.info);
  const cursor = useOther(connectionId, (user) => user.presence.cursor);

  if (!cursor) {
    return null;
  }
  const { x, y } = cursor;
  const name = info?.name || "No name";

  return (
    <foreignObject
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
      width={name.length * 10 + 24}
      height="50"
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <MousePointer2
        className="h-5 w-5"
        style={{
          fill: "red",
          color: "red",
        }}
      />
      <div
        className="absolute left-5 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold"
        style={{ backgroundColor: "red" }}
      >
        {name}
      </div>
    </foreignObject>
  );
});

Cursor.displayName = "Cursor";
```


## _components\flow.tsx

```tsx
"use client";
import "reactflow/dist/style.css";
import ReactFlow, { Controls, Background, Panel } from "reactflow";
// import { shallow } from "zustand/shallow";
import { useMyPresence, useOthers } from "@/liveblocks.config";
import { Cursor } from "./cursor";
import { Toolbar } from "./panels/toolbar";
import { BottomPanel } from "./panels/bottom-panel";
import { DownloadBtn } from "./ui/DownloadBtn";
import useStore, { RFState } from "@/app/store/store";
import { edgeTypes, nodeTypes } from "@/app/types/structs";
import { useCallback, useEffect, useRef, useState } from "react";
import ContextMenu from "./context-menu";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import { Metrics } from "./metrics/metrics";
import EditorComponent from "./editor/editorCoder";
import "./../style-test.css";
import { useRenameModal } from "@/app/store/use-rename-modal";
import BoardInfoModal from "./BoardInfoModal/BoardInfoModal";
import { ToolButton } from "./ui/ToolButton";
import { FileJson2, LayoutDashboard, HistoryIcon } from "lucide-react";
import { Loading } from "@/components/loading";
import { useVersionsHistory } from "@/app/hooks/useVersionsHistory";
import { Id } from "@/convex/_generated/dataModel";
import { useSaveHandlerOnHotkeyKeydown } from "@/app/hooks/useSaveHandlerOnKeydown";
import { HistoryModal } from "./HistoryModal";
import { useInitializeBoard } from "@/app/hooks/useInitializeBoard";

// const selector = (state: RFState) => ({
//   nodes: state.nodes,
//   edges: state.edges,
//   deleteNode: state.deleteNode,
//   onNodesChange: state.onNodesChange,
//   onEdgesChange: state.onEdgesChange,
//   onConnect: state.onConnect,
//   addNode: state.addNode,
// });
interface FlowProps {
  boardId: string;
}

interface IContextMenu {
  id: string;
  top: number;
  left: number;
  right: number | boolean;
  bottom: number | boolean;
}

const Flow = ({ boardId }: FlowProps) => {
  useInitializeBoard(boardId as Id<"boards">);

  const {
    liveblocks: { isStorageLoading },
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    deleteNode,
  } = useStore();
  const { autoSave, manualSave } = useVersionsHistory(boardId);
  useSaveHandlerOnHotkeyKeydown(manualSave);

  const [{ cursor }, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const { isVisibleEditor, setIsVisisble, isVisibleBoard, setIsVisisbleBoard } =
    useRenameModal();
  const [isVisibleHistory, setIsVisisbleHistory] = useState(false);
  const { analytics, setAnalytics } = useChangeEdgeType();
  const [menu, setMenu] = useState<IContextMenu | null>(null);
  const ref = useRef(null);

  const onNodeContextMenu = useCallback(
    (event: any, node: any) => {
      event.preventDefault();
      //@ts-ignore
      const pane = ref.current?.getBoundingClientRect();
      let menu = {
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width + 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      };
      setMenu(menu);
    },
    [setMenu]
  );

  const onPaneClick = useCallback(() => {
    setMenu(null);
  }, [setMenu]);

  useEffect(() => {
    if (isStorageLoading) return;

    autoSave();
  }, [nodes, edges, autoSave, isStorageLoading]);

  if (isStorageLoading) {
    <Loading />;
  }

  return (
    <main
      className="h-full w-full relative bg-neutral-100 touch-none"
      onPointerMove={(event) => {
        updateMyPresence({
          cursor: {
            x: Math.round(event.clientX),
            y: Math.round(event.clientY),
          },
        });
      }}
      onPointerLeave={() =>
        updateMyPresence({
          cursor: null,
        })
      }
    >
      {!isVisibleEditor && (
        <div className="z-10 w-full relative">
          <Toolbar />
        </div>
      )}

      {others.map(({ connectionId, presence }) => {
        if (presence.cursor === null) {
          return null;
        }
        return <Cursor key={connectionId} connectionId={connectionId} />;
      })}

      <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
      >
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
        <Controls position="bottom-right" />

        {isVisibleEditor && (
          <Panel position="top-left" className="position_panel">
            <EditorComponent />
          </Panel>
        )}

        <Panel position="top-center">
          <div className="bg-white rounded-md p-1.5 flex gap-x-2 items-center shadow-md">
            <ToolButton
              label="Editor"
              onClick={setIsVisisble}
              isActive={false}
              icon={FileJson2}
            />
            <DownloadBtn />
            <ToolButton
              label="Board"
              onClick={() => {
                if (isVisibleHistory) {
                  setIsVisisbleHistory(!isVisibleHistory);
                }

                setIsVisisbleBoard();
              }}
              isActive={false}
              icon={LayoutDashboard}
            />
            <ToolButton
              label="History"
              onClick={() => {
                if (isVisibleBoard) {
                  setIsVisisbleBoard();
                }

                setIsVisisbleHistory(!isVisibleHistory);
              }}
              isActive={false}
              icon={HistoryIcon}
            />
          </div>
        </Panel>

        {!analytics && !isVisibleBoard && isVisibleHistory && (
          <Panel position="top-right" className="info_panel">
            <HistoryModal
              boardId={boardId}
              onSaveRestoredVersion={manualSave}
              onClose={() => setIsVisisbleHistory(false)}
            />
          </Panel>
        )}

        {!analytics && !isVisibleHistory && isVisibleBoard && (
          <Panel position="top-right" className="info_panel">
            <BoardInfoModal boardId={boardId} handleSaveVersion={manualSave} />
          </Panel>
        )}
        <Background color="blue" gap={16} className="bg-blue-100" />
        {analytics && <Metrics />}
        <BottomPanel />
      </ReactFlow>
    </main>
  );
};

export default Flow;
```


## _components\games.tsx

```tsx
"use client";

import { useAnimateScheme } from "@/app/store/use-animate-scheme";

export const Games = () => {
  const {  games, gamesCount } = useAnimateScheme();

  return (
    <div className="text-xs text-center px-2">
      <label>Games</label>
      <div className="flex gap-x-3 items-center">
        <div>{gamesCount}</div>
        <div>/</div>
        <div>{games}</div>
      </div>
    </div>
  );
};
```


## _components\iterations.tsx

```tsx
"use client";

import { useAnimateScheme } from "@/app/store/use-animate-scheme";

export const Iterations = () => {
  const { iterationsCount, iterations } = useAnimateScheme();

  return (
    <div className="text-xs text-center px-2">
      <label>Iterations</label>
      <div className="flex gap-x-3 items-center">
        <div>{iterationsCount}</div>
        <div>/</div>
        <div>{iterations}</div>
      </div>
    </div>
  );
};
```


## layout.tsx

```tsx
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
```


## page.tsx

```tsx
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
```


## style-test.css

```css
.context-menu {
  background: white;
  border-style: solid;
  box-shadow: 10px 19px 20px rgba(0, 0, 0, 10%);
  position: absolute;
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 8px;
  z-index: 10;
}

.context-menu button {
  border: none;
  display: block;
  padding: 0.5em;
  text-align: left;
  width: 100%;
}

.context-menu button:hover {
  background: rgb(234, 248, 252);
  border-radius: 8px;
}

.position_panel {
  margin-top: 0 !important;
  margin-left: 0 !important;
  height: 785px !important;
  z-index: 100 !important;
}
.info_panel {
  margin-top: 0 !important;
  margin-right: 0 !important;
}
.analytics_panel {
  background: white;
  margin-top: 0 !important;
  margin-right: 0 !important;
  z-index: 10000 !important;
  width: 450px;
  height: 785px;
  overflow-y: auto !important;
  padding-top: 10px;
}
.values_analytics {
  margin: 2px 50px 20px;
}
.analytics__title {
  display: flex;
  justify-content: space-between;
}
.vesrsions-diff_panel {
  margin-top: 0 !important;
  margin-left: 0 !important;
  width: 850px !important;
  z-index: 100 !important;
  position: fixed;
  padding-left: 100px;
}
```

