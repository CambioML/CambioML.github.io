import { create } from 'zustand';

export enum UploadModalState {
  ADD_FILES,
  UPLOADING,
}

interface UploadModalStore {
  isOpen: boolean;
  image: string;
  uploadModalState: UploadModalState;
  onOpen: () => void;
  onClose: () => void;
  setImage: (image: string) => void;
  setUploadModalState: (uploadModalState: UploadModalState) => void;
}

export const useUploadModal = create<UploadModalStore>((set) => ({
  isOpen: false,
  image: '',
  uploadModalState: UploadModalState.ADD_FILES,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setImage: (image) => set({ image }),
  setUploadModalState: (uploadModalState) => set({ uploadModalState }),
}));
