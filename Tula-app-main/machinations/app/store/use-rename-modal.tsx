import { create } from "zustand";

const defaultValues = { id: "", title: "" };

interface IRenameModal {
  isVisibleEditor: boolean;
  isVisibleBoard: boolean;
  isVisibleHistory: boolean;
  isOpen: boolean;
  initialValues: typeof defaultValues;
  setIsVisisble: () => void;
  setIsVisisbleBoard: () => void;
  setIsVisisbleHistory: () => void;
  onOpen: (id: string, title: string) => void;
  onClose: () => void;
}

export const useRenameModal = create<IRenameModal>((set) => ({
  isVisibleEditor: false,
  isVisibleBoard: false,
  isVisibleHistory: false,
  isOpen: false,
  setIsVisisble: () => {
    set((state) => ({
      isVisibleEditor: !state.isVisibleEditor,
    }));
  },
  setIsVisisbleBoard: () => {
    set((state) => ({
      isVisibleBoard: !state.isVisibleBoard,
    }));
  },
  setIsVisisbleHistory: () => {
    set((state) => ({
      isVisibleHistory: !state.isVisibleHistory,
    }));
  },
  onOpen: (id, title) =>
    set({
      isOpen: true,
      initialValues: { id, title },
    }),
  onClose: () =>
    set({
      isOpen: false,
      initialValues: defaultValues,
    }),
  initialValues: defaultValues,
}));
