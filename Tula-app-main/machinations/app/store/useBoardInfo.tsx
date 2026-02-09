import { create } from "zustand";

interface IGenerateStore {
  description: string;
  setDescription: (text: string) => void;
}

export const useGenerate = create<IGenerateStore>((set) => ({
  description: "Тестовая доска для показа",
  setDescription: (text) => {
    set({
      description: text,
    });
  },
}));