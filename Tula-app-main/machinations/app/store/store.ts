import { createWithEqualityFn } from "zustand/traditional";
import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
} from "reactflow";
import { liveblocks } from "@liveblocks/zustand";
import type { WithLiveblocks } from "@liveblocks/zustand";
import { nanoid } from "nanoid/non-secure";

import { EdgesTypes, Graph, StructType } from "../types/structs";
import { markerEnd } from "@/utils/canvas";
import { client } from "@/liveblocks.config";
import {
  BoardState,
  BoardSavingStatus,
  PreviousState,
  BoardStateData,
} from "../types/history";

export type RFState = {
  graph: Graph;
  title: string;
  description: string | undefined;
  edgesType: string | undefined;
  currentVersion: number;
  updatedTime: number | null;
  savingStatus: BoardSavingStatus;
  edgeType: 'custom' | 'probabilistic' | 'conditional' | 'trigger' | 'modifier';
  nodes: Node[];
  edges: Edge[];
  previousState: PreviousState | null;
  isInitialized: boolean;
  initialize: (state: BoardState) => void;
  setPreviousState: (state: PreviousState) => void;
  onRestoreVersion: (stateData: BoardStateData) => void;
  onDeleteVersion: (stateData: BoardStateData) => void;
  setSavingStatus: (savingStatus: BoardSavingStatus) => void;
  addNode: (struct: StructType) => void;
  deleteNode: (id: string) => void;
  onNodesChange: OnNodesChange;
  setNodeName: (id: string, name: string) => void;
  setNodeLabel: (id: string, count: number) => void;
  updateNodeData: (nodeId: string, newData: any) => void;
  onEdgesChange: OnEdgesChange;
  getEdgeTargetNode: (id: string) => void;
  setEdgeType: (type: 'custom' | 'probabilistic' | 'conditional' | 'trigger' | 'modifier') => void;
  setEdgeData: (id: string, data: number) => void;
  setEdgeAnimated: (isPlay: boolean) => void;
  onConnect: (connection: any) => void;
  getEdgeValues: (id: string) => {
    sourceStruct: any;
    sourceValue: any;
    targetValue: any;
  };
  generateNode: (
    id: number,
    struct: string,
    label: string,
    x: number,
    y: number
  ) => void;
  generateEdge: (
    id: number,
    source: number,
    target: number,
    value: number
  ) => void;
  getNodesJson: () => any;
  getEdgesJson: () => any;
  deleteAll: () => any;
};

const graph: Graph = {
  id: 1,
  countComponents: 1,
  owner: "mc_Valera",
  created: "01.01.2002",
  modified: "01.01.2002",
  title: "Graph",
  description: "",
};

const useStore = createWithEqualityFn<WithLiveblocks<RFState>>()(
  liveblocks(
    (set, get) => ({
      graph: graph,
      savingStatus: BoardSavingStatus.IDLE,
      updatedTime: null,
      currentVersion: 0,
      previousState: null,
      nodes: [],
      edges: [],
      title: "",
      description: "",
      edgesType: "Default",
      isInitialized: false,
      initialize: (state: BoardState) => {
        set({
          nodes: state.nodes,
          edges: state.edges,
          previousState: state,
          currentVersion: state.version,
          title: state.title,
          description: state.description,
          edgesType: state.edgesType,
          isInitialized: true,
        });
      },
      setPreviousState: (state: PreviousState) => {
        set({
          previousState: state,
          currentVersion: state.version,
          updatedTime: state.createdAt,
        });
      },
      onRestoreVersion: (stateData: BoardStateData) => {
        set({
          nodes: stateData.nodes,
          edges: stateData.edges,
        });
      },
      onDeleteVersion: (stateData: BoardStateData) => {
        set({
          nodes: stateData.nodes,
          edges: stateData.edges,
        });
      },
      setSavingStatus: (status: BoardSavingStatus) => {
        set({
          savingStatus: status,
        });
      },
      onNodesChange: (changes: NodeChange[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      edgeType: 'custom' as 'custom' | 'probabilistic' | 'conditional' | 'trigger' | 'modifier',
      setEdgeType: (type) => set({ edgeType: type }),
      onConnect: (connection: Connection) => {
        const edgeType = get().edgeType;
        const baseEdge = {
          ...connection,
          id: "id" + new Date(),
          type: edgeType,
          animated: false,
          markerEnd: markerEnd,
        };
        let newEdge;

        switch (edgeType) {
          case 'probabilistic':
            newEdge = { ...baseEdge, data: { probability: 0.5 } };
            break;
          case 'conditional':
            newEdge = { ...baseEdge, data: { condition: '' } };
            break;
          case 'trigger':
            newEdge = { ...baseEdge, data: { eventName: '' } };
            break;
          case 'modifier':
            newEdge = { ...baseEdge, data: { expression: '' } };
            break;
          default: // custom
            newEdge = { ...baseEdge, data: 1 };
        }

        set({
          edges: addEdge(newEdge, get().edges),
        });
      },
      setEdgeData: (id: string, data: number) => {
        const edges = useStore.getState().edges;
        const edgeIndex = edges.findIndex((edge) => edge.id === id);

        if (edgeIndex !== -1) {
          const updatedEdge = {
            ...edges[edgeIndex],
            data: data,
          };
          const updatedEdges = [...edges];
          updatedEdges[edgeIndex] = updatedEdge;
          set({
            edges: updatedEdges,
          });
        }
      },
      deleteNode: (id: string) => {
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== id),
          edges: state.edges.filter(
            (edge) => edge.source !== id && edge.target !== id
          ),
        }));
      },
      updateNodeData: (nodeId: string, newData: any) => {
        set((state) => ({
          nodes: state.nodes.map(node => 
            node.id === nodeId ? { ...node, data: newData } : node
          ),
        }));
      },
      setEdgeAnimated: (isPlay: boolean) => {
        if (isPlay) {
          const edges = useStore.getState().edges.map((edge) => ({
            ...edge,
            animated: true,
            style: { stroke: "red" },
          }));
          set({
            edges: edges,
          });
        } else {
          const edges = useStore.getState().edges.map((edge) => ({
            ...edge,
            animated: false,
            style: { stroke: "black" },
          }));
          set({
            edges: edges,
          });
        }
      },
      getEdgeTargetNode: (id: string) => {
        const edges: Edge[] = useStore.getState().edges;
        const edge = edges.find((edge: Edge) => edge.id === id);
        return edge?.target;
      },
      getEdgeValues: (id: string) => {
        const edges: Edge[] = useStore.getState().edges;
        const edge = edges.find((edge: Edge) => edge.id === id);
        const nodes: Node[] = useStore.getState().nodes;

        const sourceNode = nodes.find((node) => node.id === edge?.source);
        const targetNode = nodes.find((node) => node.id === edge?.target);

        return {
          sourceStruct: sourceNode?.data.struct,
          sourceValue: sourceNode?.data.label || "0",
          targetValue: targetNode?.data.label || "0",
        };
      },
      setNodeLabel: (id: string, count: number) => {
        const nodes = useStore.getState().nodes;
        const nodeIndex = nodes.findIndex((node) => node.id === id);

        if (nodeIndex !== -1) {
          const updatedNodes = [...nodes];
          updatedNodes[nodeIndex] = {
            ...updatedNodes[nodeIndex],
            data: {
              ...updatedNodes[nodeIndex].data,
              label: count,
            },
          };

          set({
            nodes: updatedNodes,
          });
        }
      },
      setNodeName: (id: string, name: string) => {
        const nodes = useStore.getState().nodes;
        const nodeIndex = nodes.findIndex((node) => node.id === id);

        if (nodeIndex !== -1) {
          const updatedNodes = [...nodes];
          updatedNodes[nodeIndex] = {
            ...updatedNodes[nodeIndex],
            data: {
              ...updatedNodes[nodeIndex].data,
              name: name,
            },
          };

          set({
            nodes: updatedNodes,
          });
        }
      },

      addNode: (struct: StructType) => {
        let newNode;

        const baseNode = {
          id: nanoid(),
          position: {
            x: (Math.random() * window.innerWidth) / 2,
            y: (Math.random() * window.innerHeight) / 2,
          },
        };

        switch (struct) {
          case StructType.Source:
            newNode = {
              ...baseNode,
              type: 'sourceNode',
              data: { label: '0', struct: StructType.Source, name: '', generationRate: 1, triggerEvent: '' },
            };
            break;
          case StructType.Pool:
            newNode = {
              ...baseNode,
              type: 'poolNode',
              data: { label: '0', struct: StructType.Pool, name: '', resourceType: '', min: 0, max: 100, initialValue: 0 },
            };
            break;
          case StructType.Converter:
            newNode = {
              ...baseNode,
              type: 'converterNode',
              data: { label: '0', struct: StructType.Converter, name: '', conversionIn: 1, conversionOut: 1, converterProbEffects: [] },
            };
            break;
          case StructType.Gate:
            newNode = {
              ...baseNode,
              type: 'gateNode',
              data: { label: '0', struct: StructType.Gate, name: '', gateType: 'probabilistic' },
            };
            break;
          case StructType.Delay:
            newNode = {
              ...baseNode,
              type: 'delayNode',
              data: { label: '0', struct: StructType.Delay, name: '', delaySteps: 1 },
            };
            break;
          case StructType.End:
            newNode = {
              ...baseNode,
              type: 'endNode',
              data: { label: '0', struct: StructType.End, name: '', endType: 'win' },
            };
            break;
          case StructType.Trigger:
            newNode = {
              ...baseNode,
              type: 'triggerNode',
              data: { label: '0', struct: StructType.Trigger, name: '', triggerEvent: '' },
            };
            break;
          case StructType.Entity:
            newNode = {
              ...baseNode,
              type: 'entityNode',
              data: { label: '0', struct: StructType.Entity, name: '', states: [], events: [] },
            };
            break;
          case StructType.State:
            newNode = {
              ...baseNode,
              type: 'stateNode',
              data: { label: '0', struct: StructType.State, name: '', valueType: 'int', range: [0, 100] },
            };
            break;
          case StructType.Event:
            newNode = {
              ...baseNode,
              type: 'eventNode',
              data: { label: '0', struct: StructType.Event, name: '', requires: '', effect: '', probability: 0.5 },
            };
            break;
          case StructType.Rule:
            newNode = {
              ...baseNode,
              type: 'ruleNode',
              data: { label: '0', struct: StructType.Rule, name: '', when: '', effect: '' },
            };
            break;
          case StructType.Operator:
            newNode = {
              ...baseNode,
              type: 'operatorNode',
              data: { label: '0', struct: StructType.Operator, operator: 'X' },
            };
            break;
          default:
            newNode = {
              ...baseNode,
              type: struct.toLowerCase() + "Node",
              data: { label: "0", struct: struct, name: "" },
            };
        }

        set({
          nodes: [...get().nodes, newNode],
        });
      },
      generateNode: (
        id: number,
        structString: string,
        label: string,
        x: number,
        y: number
      ) => {
        let struct = structString[0].toUpperCase() + structString.slice(1);
        let newNode;
        structString === "source"
          ? (newNode = {
              id: id.toString(),
              type: struct.toLowerCase() + "Node",
              data: { label: "0", struct: struct, name: label },
              position: {
                x: x ? x : (Math.random() * window.innerWidth) / 2 / 2,
                y: y ? y : (Math.random() * window.innerHeight) / 2 / 2,
              },
            })
          : structString === "end"
            ? (newNode = {
                id: id.toString(),
                type: struct.toLowerCase() + "Node",
                data: { label: "0", struct: struct, name: label },
                position: {
                  x: x
                    ? x
                    : (Math.random() * window.innerWidth) / 2 +
                      window.innerWidth / 2,
                  y: y
                    ? y
                    : (Math.random() * window.innerHeight) / 2 +
                      window.innerHeight / 2,
                },
              })
            : (newNode = {
                id: id.toString(),
                type: struct.toLowerCase() + "Node",
                data: { label: "0", struct: struct, name: label },
                position: {
                  x: x ? x : (Math.random() * window.innerWidth) / 2,
                  y: y ? y : (Math.random() * window.innerHeight) / 2,
                },
              });

        set({
          nodes: [...get().nodes, newNode],
        });
      },
      generateEdge(id: number, source: number, target: number, value: number) {
        const newEdge = {
          id: id.toString(),
          source: source.toString(),
          target: target.toString(),
          key: "id" + new Date(),
          type: "custom",
          animated: false,
          markerEnd: markerEnd,
          data: value,
        };
        set((state) => ({
          edges: [...get().edges, newEdge],
        }));
      },
      getNodesJson: () => {
        const arr = get().nodes.map((el) => {
          return `    {
          "id": "${el.id}",
          "element_type": "node",
          "type": "${el.type}",
          "struct": "${el.data.struct.toLowerCase()}",
          "label": "${el.data.name ? el.data.name.toLowerCase() : "null"}",
          "position": {
            "data": {
              "x": ${el.position.x},
              "y": ${el.position.y}
            }
          }
        }`;
        });
        return arr;
      },
      getEdgesJson: () => {
        const arr = get().edges.map((el) => {
          return `    {
          "id": "${el.id}",
          "element_type": "edge",
          "source_id": "${el.source}",
          "target_id": "${el.target}",
          "data": "${el?.data}"
        }`;
        });
        return arr;
      },
      deleteAll: () => {
        set((state) => ({
          edges: [],
          nodes: [],
        }));
      },
    }),
    {
      // Add Liveblocks client
      client,
      // presenceMapping: { cursor: true, selection: true },
      // Define the store properties that should be shared in real-time
      storageMapping: {
        nodes: true,
        edges: true,
      },
    }
  )
);

export default useStore;
