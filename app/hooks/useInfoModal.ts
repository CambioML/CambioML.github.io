import { create } from 'zustand';

interface InfoModalStore {
  isOpen: boolean;
  content: React.ReactElement | null;
  title: string;
  onOpen: () => void;
  onClose: () => void;
  setContent: (content: React.ReactElement) => void;
  setTitle: (title: string) => void;
}

const useInfoModal = create<InfoModalStore>((set) => ({
  isOpen: false,
  content: null,
  title: '',
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setContent: (content) => set({ content }),
  setTitle: (title) => set({ title }),
}));

export default useInfoModal;
