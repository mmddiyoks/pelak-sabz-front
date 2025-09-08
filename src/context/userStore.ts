import { create } from "zustand";
import { AuthStore } from "../models/Auth";
import { UserStore } from "../models/User";

export const userStore = create<AuthStore>((set) => ({
  user: {},
  isLoading: true,
  setILoading: (data: boolean) => {
    set({ isLoading: data });
  },
  setUser: (data: UserStore) => {
    //@ts-ignore
    set({ user: data });
  },
}));
