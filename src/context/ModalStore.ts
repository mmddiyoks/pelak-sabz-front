import { ReactNode } from "react";
import { create } from "zustand";

type Store = {
  isOpen: boolean;
  title: string;
  setTitle: (data: string) => void;
  openModal: () => void;
  closeModal: () => void;
  body: ReactNode | null;
  setBody: (body: ReactNode) => void;
  onCloseModal: (() => void) | null;
  setOnCloseModal: (callback: () => void) => void;
};

const useModalStore = create<Store>((set) => ({
  isOpen: false,
  title: "",
  setTitle: (title: string) => set({ title }),

  body: null,
  setBody: (body: ReactNode) => set({ body }),

  openModal: () => {
    set({ isOpen: true });
  },

  onCloseModal: null,

  closeModal: () => {
    set((state: Store) => {
      if (state.onCloseModal) {
        state.onCloseModal();
      }

      return { isOpen: false };
    });
  },

  setOnCloseModal: (callback: () => void) => set({ onCloseModal: callback }),
}));

export default useModalStore;
