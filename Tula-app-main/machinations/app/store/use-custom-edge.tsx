import { create } from "zustand";
import { EdgesTypes } from "@/app/types/structs";

interface ICustomEdge {
  error: string | null;
  currentEdgesType: string | EdgesTypes;
  onChangeEdgesType: (type: EdgesTypes) => void;
  setError: (error: string | null) => void;
  analytics: boolean;
  setAnalytics: (isShow: boolean) => void;
}

export const useChangeEdgeType = create<ICustomEdge>((set) => ({
  error: null,
  analytics: false,
  setAnalytics: (isShow: boolean) =>
    set({
      analytics: isShow,
    }),
  currentEdgesType: "Default",
  setError: (error: string | null) =>
    set({
      error: error,
    }),
  onChangeEdgesType: (type: EdgesTypes) =>
    set({
      currentEdgesType: type,
    }),
}));
