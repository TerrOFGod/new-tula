import { create } from 'zustand';

interface NodeDetailsStore {
  isOpen: boolean;
  nodeId: string | null;
  nodeType: string | null;
  openDetails: (nodeId: string, nodeType: string) => void;
  closeDetails: () => void;
}

export const useNodeDetails = create<NodeDetailsStore>((set) => ({
  isOpen: false,
  nodeId: null,
  nodeType: null,
  openDetails: (nodeId, nodeType) => set({ isOpen: true, nodeId, nodeType }),
  closeDetails: () => set({ isOpen: false, nodeId: null, nodeType: null }),
}));