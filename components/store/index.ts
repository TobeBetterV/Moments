import { create } from "zustand";

interface MomentsUIState {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (state: boolean) => void;
  isShowConfetti: boolean;
  setIsShowConfetti: (state: boolean) => void;
}

const useMomentsUIStateStore = create<MomentsUIState>()((set) => ({
  isSidebarOpen: true,
  setIsSidebarOpen: (state) => set(() => ({ isSidebarOpen: state })),
  isShowConfetti: false,
  setIsShowConfetti: (state) => set(() => ({ isShowConfetti: state })),
}));

export { useMomentsUIStateStore };
