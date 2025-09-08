import { UserStore } from "./User";

export type AuthStore = {
  user: UserStore;
  setILoading: (data: boolean) => void;
  setUser: (data: any) => void;
  isLoading: boolean;
};
