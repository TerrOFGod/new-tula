// app/store/use-entity-expanded.ts
import { create } from "zustand";

interface EntityExpandedStore {
  expanded: Record<string, boolean>;
  toggle: (id: string) => void;
  setExpanded: (id: string, expanded: boolean) => void;
}

export const useEntityExpanded = create<EntityExpandedStore>((set) => ({
  expanded: {},
  toggle: (id) =>
    set((state) => ({ expanded: { ...state.expanded, [id]: !state.expanded[id] } })),
  setExpanded: (id, expanded) =>
    set((state) => ({ expanded: { ...state.expanded, [id]: expanded } })),
}));