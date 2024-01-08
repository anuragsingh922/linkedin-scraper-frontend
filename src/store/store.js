import { create } from "zustand";

export const useZustandStore = create()((set) => ({
  user: {},
  refetch: true,
  isSignedIn: true,
  setUser: (user) => set({ user }),
  setRefetch: (refetch) => set({ refetch }),
  setIsSignedIn: (isSignedIn) => set({ isSignedIn }),
}));
